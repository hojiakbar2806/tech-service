from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.enums import Roles
from app.database.models.user import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str):
        query = select(User).where(User.email == email)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def create_user(self, user_data: dict) -> User:
        user = User(**user_data)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def get_user_by_id(self, user_id: int) -> User:
        query = select(User).filter(User.id == user_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def get_master_by_id(self, master_id: int) -> User:
        stmt = select(User).where(
            (User.id == master_id) & (User.role == Roles.MASTER)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_users(self) -> list[User]:
        query = select(User)
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def update_user(self, user: User):
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
