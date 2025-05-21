from urllib.request import Request
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import ResourceNotFoundException
from app.repositories.notification import NotificationRepository
from app.repositories.user import UserRepository
from app.utils.email import send_notification
from app.schemas.notification import NotificationCreate, NotificationResponse


class NotificationController:
    def __init__(self, db: AsyncSession):
        self.notification_repo = NotificationRepository(db)
        self.user_repo = UserRepository(db)

    async def get_my_notifications(self, request: Request):
        user_id = getattr(request.state, "user").get("id")
        notifications = await self.notification_repo.get_my_notifications(user_id)
        return [NotificationResponse.model_validate(notif) for notif in notifications]

    async def send_notification(self, data_in: NotificationCreate, request: Request):
        db_user = await self.user_repo.get_user_by_id(data_in.receiver_id)
        if not db_user:
            raise HTTPException(
                status_code=404, detail="Foydalanuvchi topilmadi"
            )
        await send_notification("So'rovnoma tasdiqlandi",db_user.email, data_in.message)
        sender_id = getattr(request.state, "user").get("id")
        await self.notification_repo.create_notification({**data_in.model_dump(), "sender_id": sender_id})
        return JSONResponse({"message": "Xabar muvaffaqiyatli yaratildi"})

    async def set_as_read(self, list: int):
        try:
            for notif_id in list:
                await self.notification_repo.partial_update(notif_id, {"seen": True})
        except ResourceNotFoundException as e:
            raise HTTPException(detail=str(e))
        return JSONResponse({"message": "Xabar muvaffaqiyatli tekshirildi"})
