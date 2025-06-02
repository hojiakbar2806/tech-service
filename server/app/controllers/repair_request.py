import secrets
from typing import Optional
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.utils.auth import auth_service
from app.utils.hash import hash_password
from app.core.enums import RequestStatus, Roles
from app.controllers.auth import AuthController
from app.repositories.user import UserRepository
from app.utils.email import send_auth_link_to_user
from app.core.exceptions import ResourceNotFoundException
from app.repositories.notification import NotificationRepository
from app.repositories.repair_request import RepairRequestRepository
from app.schemas.repair_request import PersonalizedRepairRequest, RepairRequestResponse, RepairRequestWithUserRequest


class RepairRequestController:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repair_request_repo = RepairRequestRepository(db)
        self.user_repo = UserRepository(db)
        self.auth_controller = AuthController(db)
        self.notification_repo = NotificationRepository(db)

    async def _get_user_id(self, request: Request):
        return getattr(request.state, "user").get("id")

    async def _send_and_create_notifications(self, users, title, message, sender_id, request_id, for_action="aprove"):
        for user in users:
            await self.notification_repo.create_notification({
                "title": f"{title}: {request_id}",
                "receiver_id": user.id,
                "for_action": for_action,
                "request_id": request_id,
                "sender_id": sender_id,
                "message": message
            })
        await self.db.commit()

    async def create_request_with_user(self, data_in: RepairRequestWithUserRequest):
        db_user = await self.user_repo.get_by_email(data_in.user_data.email)
        new_password = None

        if db_user:
            user = db_user
        else:
            new_password = secrets.token_urlsafe(8)
            hashed_pw = hash_password(new_password)
            data = data_in.user_data.model_dump()
            data["hashed_password"] = hashed_pw
            user = await self.user_repo.create_user(data)
            token = auth_service.create_one_time_token(user.id)
            auth_url = f"{settings.client_url}/auth/verify/{token}"
            await send_auth_link_to_user(user.email, auth_url, user.first_name, new_password)

        request_data = data_in.repair_request.model_dump()
        request_data["owner_id"] = user.id
        db_obj = await self.repair_request_repo.create_request(request_data, refresh=True)

        return JSONResponse({"message": f"So'rovnoma muvaffaqiyatli yaratildi. ID: {db_obj.id}"})

    async def personalize_order(self, id: int, data_in: PersonalizedRepairRequest, request: Request):
        try:
            user_id = await self._get_user_id(request)
            update_data = {
                "master_id": user_id,
                "price": data_in.price,
                "end_date": data_in.end_date,
                "status": RequestStatus.APPROVED,
                **data_in.model_dump(exclude={"components", "price", "end_date"})
            }
            req = await self.repair_request_repo.partial_update(id, update_data)
            components = [c.model_dump() for c in data_in.components]
            await self.repair_request_repo.attach_components_to_request(id, components)

            owner = await self.user_repo.get_user_by_id(req.owner_id)
            managers = await self.user_repo.get_all_users(role=Roles.MANAGER)

            await self._send_and_create_notifications(
                [owner] + managers,
                f"So'rovnoma {id} master tomonidan qabul qilindi",
                "So'rovnoma master tomonidan tasdiqlandi va ma'lumotlar yangilandi.",
                user_id,
                id,
                "view"
            )

            return JSONResponse({"message": "So'rovnoma master tomonidan tasdiqlandi va yangilandi."})

        except ResourceNotFoundException as e:
            raise HTTPException(status_code=404, detail=str(e))

    async def update_status(self, id: int, status: RequestStatus, request: Request, message: Optional[str] = None):
        try:
            user_id = await self._get_user_id(request)
            db_obj = await self.repair_request_repo.partial_update(id, {"status": status})

            owner = await self.user_repo.get_user_by_id(db_obj.owner_id)
            master = await self.user_repo.get_user_by_id(db_obj.master_id) if db_obj.master_id else None
            managers = await self.user_repo.get_all_users(role=Roles.MANAGER)

            if status == RequestStatus.APPROVED:
                sender = await self.user_repo.get_user_by_id(user_id)
                if sender.role == Roles.MANAGER:
                    await self._send_and_create_notifications(
                        [owner],
                        "So'rovnoma menejer tomonidan tasdiqlandi",
                        "Buyurtmangiz menejer tomonidan tasdiqlandi.",
                        user_id,
                        id,
                        "view"
                    )
                elif sender.role == Roles.USER:
                    recipients = managers + ([master] if master else [])
                    await self._send_and_create_notifications(
                        recipients,
                        "Foydalanuvchi so'rovnomani tasdiqladi",
                        "So‘rovnoma foydalanuvchi tomonidan tasdiqlandi.",
                        user_id,
                        id,
                        "view"
                    )
            else:
                messages = {
                    RequestStatus.REJECTED: "So'rovnoma rad etildi",
                    RequestStatus.COMPLETED: "So'rovnoma bajarildi",
                    RequestStatus.IN_PROGRESS: "Ish jarayoni boshlandi",
                    RequestStatus.CHECKED: "So'rovnoma tekshirildi"
                }
                msg = message or messages.get(
                    status, f"So'rovnoma statusi {status.name} ga o'zgartirildi")
                if owner:
                    await self._send_and_create_notifications(
                        [owner],
                        "So'rovnoma holati yangilandi",
                        msg,
                        user_id,
                        id,
                        "view"
                    )

            return JSONResponse({"message": f"So'rovnoma holati: {status.name}"})

        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def set_as_approved(self, id: int, request: Request):
        return await self.update_status(id, RequestStatus.APPROVED, request)

    async def set_as_rejected(self, id: int, request: Request):
        return await self.update_status(id, RequestStatus.REJECTED, request)

    async def set_as_completed(self, id: int, request: Request):
        return await self.update_status(id, RequestStatus.COMPLETED, request)

    async def set_as_in_progress(self, id: int, request: Request):
        return await self.update_status(id, RequestStatus.IN_PROGRESS, request, "Ishni boshlandi!")

    async def set_as_checked(self, id: int, request: Request):
        return await self.update_status(id, RequestStatus.CHECKED, request)

    async def get_repair_request(self, id: int):
        try:
            request_obj = await self.repair_request_repo.get_by_id(id)
            return RepairRequestResponse.model_validate(request_obj)
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def get_all(self, status: Optional[RequestStatus] = None):
        requests = await self.repair_request_repo.get_all(status)
        return [RepairRequestResponse.model_validate(req) for req in requests]

    async def get_my_repair_requests(self, request: Request):
        user_id = await self._get_user_id(request)
        return await self.repair_request_repo.get_by_owner_id(user_id)

    async def get_master_repair_requests(self, request: Request):
        user_id = await self._get_user_id(request)
        return await self.repair_request_repo.get_by_master_id(user_id)

    async def delete_request(self, id: int):
        try:
            await self.repair_request_repo.delete_request(id)
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli o'chirildi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))
