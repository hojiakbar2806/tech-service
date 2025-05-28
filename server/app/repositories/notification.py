from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ResourceNotFoundException
from app.database.models.mixin import Notification


class NotificationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_notification(self, notification: dict) -> dict:
        notif = Notification(**notification)
        self.db.add(notif)
        await self.db.commit()
        return notif

    async def get_my_notifications(self, user_id: int):
        query = select(Notification).where(
            Notification.receiver_id == user_id
        ).options(
            selectinload(Notification.sender),
            selectinload(Notification.receiver)
        ).order_by(Notification.created_at.desc())
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_by_id(self, id: int):
        query = select(Notification).where(
            Notification.id == id
        ).options(
            selectinload(Notification.sender),
            selectinload(Notification.receiver)
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def partial_update(self, id: int, data: dict):
        notification = await self.get_by_id(id)
        if notification is None:
            raise ResourceNotFoundException("Notification", id)
        for key, value in data.items():
            if key != "id" and hasattr(notification, key) and value is not None:
                setattr(notification, key, value)
        await self.db.commit()
        await self.db.refresh(notification)
        return notification
