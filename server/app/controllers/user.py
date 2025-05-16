from fastapi import HTTPException
from app.core.enums import Roles, TokenType
from app.core.exceptions import EmailException, JWTException
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.auth import AuthRepository
from app.repositories.user import UserRepository

from app.utils.response import response as res
from app.schemas.user import UserCreate, UserResponse
from app.utils.hash import hash_password


class UserController:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)

    async def create_user(self, user_in: UserCreate) -> UserResponse:
        user_in_db = await self.user_repo.get_by_email(user_in.email)
        if user_in_db:
            raise res.bad_request("Email avval ro'yxatdan o'tgan")
        hashed_password = hash_password(user_in.hashed_password)
        user_data = user_in.model_dump()
        user_data["hashed_password"] = hashed_password
        await self.user_repo.create_user(user_data)
        return res.success("Foydalanuvchu Muvaffaqiyatli yaratildi")

    async def get_all_users(self) -> list[UserResponse]:
        users = await self.user_repo.get_all_users()
        return [UserResponse.model_validate(user) for user in users]

    async def update_user_role(self, user_id: int, role: Roles) -> UserResponse:
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            raise res.not_found("Foydalanuvchi topilmadi")
        user.role = role
        await self.user_repo.update_user(user)
        return UserResponse.model_validate(user)
