from http.client import HTTPException
from urllib.request import Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.notification import NotificationRepository
from app.schemas.notification import NotificationCreate

class NotificationController:
    def __init__(self, db: AsyncSession):
        self.notification_repo = NotificationRepository(db)

    async def get_my_notifications(self, request: Request): 
        user_id = getattr(request.state, "user").get("id")
        return await self.notification_repo.get_my_notifications(user_id)
    
    async def send_notification(self, notification: NotificationCreate, request: Request):
        sender_id = getattr(request.state, "user").get("id")
        return await self.notification_repo.create_notification({**notification.model_dump(), "sender_id": sender_id}, sender_id)