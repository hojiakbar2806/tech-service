from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from app.core.enums import Roles
from app.core.exceptions import JWTException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import UserRepository

from app.schemas.user import UserCreate, UserResponse, PartialUpdateUser
from app.utils.hash import hash_password, verify_password


class UserController:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)

    async def create_user(self, user_in: UserCreate) -> UserResponse:
        user_in_db = await self.user_repo.get_by_email(user_in.email)
        if user_in_db:
            raise HTTPException(
                status_code=400, detail="Email allaqchon ro'yxatdan o'tgan")
        hashed_password = hash_password(user_in.hashed_password)
        user_data = user_in.model_dump()
        user_data["hashed_password"] = hashed_password
        await self.user_repo.create_user(user_data)
        return JSONResponse({"message": "Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tdi"})

    async def get_all_users(self, role: Roles) -> list[UserResponse]:
        users = await self.user_repo.get_all_users(role)
        return [UserResponse.model_validate(user) for user in users]

    async def update_user_role(self, user_id: int, role: Roles) -> UserResponse:
        user = await self.user_repo.get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=404, detail="Foydalanuvchi topilmadi")
        user.role = role
        await self.user_repo.update_user(user)
        return UserResponse.model_validate(user)

    async def partial_update_user(self, request: Request, data_in: PartialUpdateUser) -> UserResponse:
        try:
            user_id = getattr(request.state, "user").get("id")
            db_user = await self.user_repo.get_user_by_id(user_id)
            if not db_user:
                raise HTTPException(
                    status_code=404, detail="Foydalanuvchi topilmadi")
            if data_in.hashed_password:
                if not data_in.old_password:
                    raise HTTPException(
                        status_code=400, detail="Oldingi parolni kiritishingiz shart"
                    )
                if verify_password(data_in.old_password, db_user.hashed_password):

                    data_in.hashed_password = hash_password(data_in.hashed_password)
                else:
                    raise HTTPException(
                        status_code=400, detail="Parol mos kelmadi")
            updated_user = await self.user_repo.partial_update_user(user_id, data_in.model_dump())
            return UserResponse.model_validate(updated_user)
        except JWTException as e:
            raise HTTPException(status_code=401, detail=str(e))
