from typing import List, Optional
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import RequestStatus, Roles
from app.controllers.auth import AuthController
from app.repositories.notification import NotificationRepository
from app.repositories.user import UserRepository
from app.core.exceptions import ResourceNotFoundException
from app.repositories.repair_request import RepairRequestRepository
from app.schemas.repair_request import PersonalizedRepairRequest, RepairRequestCreate, RepairRequestResponse
from app.utils.email import send_auth_link_to_user, send_notification
from app.utils.auth import auth_service
from app.core.config import settings


class RepairRequestController:
    def __init__(self, db: AsyncSession):
        self.repair_request_repo = RepairRequestRepository(db)
        self.user_repo = UserRepository(db)
        self.auth_controller = AuthController(db)
        self.notification_repo = NotificationRepository(db)

    async def create_request_by_email(self, email: str, data_in: RepairRequestCreate):
        db_user = await self.user_repo.get_by_email(email)
        if db_user:
            user = db_user
        else:
            user = await self.user_repo.create_user({"email": email})

        data = data_in.model_dump()
        data["owner_id"] = user.id
        db_obj = await self.repair_request_repo.create_request(data, refresh=True)
        await send_notification("Yangi so'rovnoma yaratildi", email, data_in.description)
        await self.notification_repo.create_notification({
            "title": f"Yangi so'rovnoma yaratildi: {db_obj.id}",
            "receiver_id": user.id,
            "for_action": "aprove",
            "request_id": db_obj.id,
            "sender_id": user.id,
            "message": data_in.description
        })
        token = auth_service.create_one_time_token(user.id)
        await send_auth_link_to_user(email,  f"{settings.client_url}/auth/verify/{token}")
        return JSONResponse({"message": f"So'rovnoma muvaffaqiyatli yaratildi {db_obj.id}"})

    async def create(self, request: Request, data_in: RepairRequestCreate):
        owner_id = getattr(request.state, "user").get("id")
        data = data_in.model_dump()
        data["owner_id"] = owner_id
        db_obj = await self.repair_request_repo.create_request(data, refresh=True)
        master_users = await self.user_repo.get_all_users(role=Roles.MANAGER)
        for user in master_users:
            msg = {
                "title": f"Yangi so'rovnoma yaratildi: {db_obj.id}",
                "receiver_id": user.id,
                "sender_id": owner_id,
                "message": data_in.description
            }
            await self.notification_repo.create_notification(msg)
            await send_notification(msg["title"], user.email, msg["message"])
        return JSONResponse({"message": "So'rovnoma muvaffaqiyatli yaratildi"})

    async def get_repair_request(self, id: int):
        try:
            request = await self.repair_request_repo.get_by_id(id)
            return RepairRequestResponse.model_validate(request)
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def get_all(self, status: Optional[RequestStatus] = None) -> List[RepairRequestResponse]:
        request = await self.repair_request_repo.get_all(status)
        return [RepairRequestResponse.model_validate(req) for req in request]

    async def get_my_repair_requests(self, request: Request) -> List[RepairRequestResponse]:
        user_id = getattr(request.state, "user").get("id")
        repair_requests = await self.repair_request_repo.get_by_owner_id(user_id)
        return repair_requests

    async def get_master_repair_requests(self, request: Request) -> List[RepairRequestResponse]:
        user_id = getattr(request.state, "user").get("id")
        repair_requests = await self.repair_request_repo.get_by_master_id(user_id)
        return repair_requests

    async def personalize_order(self, id: int, data_in: PersonalizedRepairRequest, request: Request):
        try:
            user_id = getattr(request.state, "user").get("id")
            await self.repair_request_repo.partial_update(id, {"master_id": user_id, **data_in.model_dump(), "status": RequestStatus.APPROVED})
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli olindi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def set_as_rejected(self, id: int, request: Request):
        try:
            db_obj = await self.repair_request_repo.partial_update(id, {"status": RequestStatus.REJECTED})
            msg = {
                "title": f"So'rovnoma bekor qilindi : {db_obj.id}",
                "request_id": db_obj.id,
                "receiver_id": db_obj.owner_id,
                "message": "Sizning so'rovnomangiz ma'lum sabablarga ko'ra bekor qilindi so'rovnomani qayta yuborishingizni tavsiya qilamiz",
                "sender_id": db_obj.master_id
            }
            await self.notification_repo.create_notification(msg)
            await send_notification(msg["title"], db_obj.owner.email, msg["message"])
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli rad etildi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def set_as_approved(self, id: int, request: Request):
        try:
            user_id = getattr(request.state, "user").get("id")
            db_obj = await self.repair_request_repo.partial_update(id, {"status": RequestStatus.APPROVED})
            masters = await self.user_repo.get_all_users(role=Roles.MASTER)
            for master in masters:
                msg = {
                    "title": f"Yangi so'rovnoma tasdiqlandi: {db_obj.id}",
                    "receiver_id": db_obj.owner_id,
                    "sender_id": user_id,
                    "for_action": "approve",
                    "message": "Sizning so'rovnomangiz tasdiqlandi bizning xizmatimiz va narxlarimiz sizga ma'qul bo'lsa murojatlar bo'limiga o'tib tasdiqlash tugmasini bosing"
                }
                await self.notification_repo.create_notification(msg)
                await send_notification(msg["title"], master.email, msg["message"])
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli qabul qilindi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def set_as_completed(self, id: int):
        try:
            await self.repair_request_repo.partial_update(id, {"status": RequestStatus.COMPLETED})
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli tekshirildi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def set_as_in_progress(self, id: int, request: Request):
        user_id = getattr(request.state, "user").get("id")
        try:
            db_obj = await self.repair_request_repo.partial_update(id, {"status": RequestStatus.IN_PROGRESS})
            msg = {
                "title": f"Yangi so'rovnoma tasdiqlandi: {id}",
                "receiver_id": db_obj.master.id,
                "sender_id": user_id,
                "for_action": "approve",
                "message": "Boshlashingiz mumkin"
            }
            await self.notification_repo.create_notification(msg)
            await send_notification(msg["title"], db_obj.master.email, msg["message"])
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli rad etildi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def set_as_checked(self, id: int, request: Request):
        try:
            user_id = getattr(request.state, "user").get("id")
            db_obj = await self.repair_request_repo.partial_update(id, {"status": RequestStatus.CHECKED})
            msg = {
                "title": f"Yangi so'rovnoma tasdiqlandi: {db_obj.id}",
                "receiver_id": db_obj.owner_id,
                "sender_id": user_id,
                "for_action": "view",
                "message": "Sizning so'rovnomangiz tasdiqlandi bizning xizmatimiz va narxlarimiz sizga ma'qul kelsa tasdiqlash tugmasini bosing"
            }
            await self.notification_repo.create_notification(msg)
            await send_notification(msg["title"], db_obj.owner.email, msg["message"])
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli tekshirildi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))

    async def delete_request(self, id: int):
        try:
            await self.repair_request_repo.delete_request(id)
            return JSONResponse({"message": "So'rovnoma muvaffaqiyatli o'chirildi"})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))
