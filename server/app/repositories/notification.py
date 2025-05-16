from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.models.mixin import Notification

class NotificationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_notification(self, notification:dict,  refresh: bool = False) -> dict:
        notif = Notification(**notification)
        self.db.add(notif)
        await self.db.commit()
        if refresh:
            await self.db.refresh(notif)
        return notif

    
    async def get_my_notifications(self, user_id: int):
        query = select(Notification).where(
            Notification.receiver_id == user_id
            ).options(
                selectinload(Notification.sender), 
                selectinload(Notification.receiver)
            )
        result = await self.db.execute(query)
        return result.scalars().all()
    
    
