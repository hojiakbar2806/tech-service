from fastapi import HTTPException, Request
from app.core.enums import Roles, TokenType
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.auth import AuthRepository
from app.repositories.user import UserRepository
from app.core.exceptions import EmailException, JWTException
from fastapi.responses import JSONResponse, RedirectResponse

from app.core.config import settings
from app.utils.auth import auth_service
from app.schemas.user import UserResponse
from app.schemas.auth import UserRegisterRequest
from app.utils.hash import verify_password
from app.utils.email import send_auth_link_to_user


class AuthController:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)
        self.auth_repo = AuthRepository(db)

    async def _get_user_id(self, request: Request) -> int:
        user_id = getattr(request.state, "user").get("id")
        return user_id

    async def send_auth_link(self, email: str) -> dict:
        try:
            user = await self.user_repo.get_by_email(email)
            if not user:
                user = await self.user_repo.create_user({"email": email})
            if user.role != Roles.USER:
                raise HTTPException(
                    status_code=400, detail="Siz ga faqat login parol bilan kirishga ruxsat etilgan"
                )
            token = auth_service.create_one_time_token(user.id)
            await send_auth_link_to_user(email, f"{settings.client_url}/auth/verify/{token}",user.first_name,)
            return JSONResponse(
                status_code=200,
                content={
                    "status": "success",
                    "message": "Email muvaffaqiyatli yuborildi"
                }
            )
        except EmailException as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def verify_auth_link(self, token: str) -> dict:
        try:
            token_in_blacklist = await self.auth_repo.check_token_blacklist(token)
            if token_in_blacklist:
                raise HTTPException(
                    status_code=400, detail="Token allaqchon ishlatilgan")

            await self.auth_repo.add_token_blacklist(token, TokenType.ONE_TIME)

            payload = await auth_service.verify_jwt_token(token, [TokenType.ONE_TIME])
            refresh_token = auth_service.create_refresh_token(payload)

            response = JSONResponse(
                status_code=200,
                content={
                    "status": "success",
                    "message": "Kirish muvaffaqiyatli amalga oshirildi",
                }
            )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="strict"
            )
            return response
        except JWTException as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def login(self, username: str, password: str) -> dict:
        user = await self.user_repo.get_by_email(username)
        if not user or not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=400, detail="Email yoki parol xato")
        user_data = UserResponse.model_validate(user).model_dump()
        access_token = auth_service.create_access_token(user_data)
        refresh_token = auth_service.create_refresh_token(user.id)
        response = JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "Kirish muvaffaqiyatli amalga oshirildi",
                "access_token": access_token,
                "role": user.role
            }
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="strict"
        )
        return response
    
    async def register(self, data_in: UserRegisterRequest) -> dict:
        try:
            user = await self.user_repo.create_user(data_in.model_dump())
            user_data = UserResponse.model_validate(user).model_dump()
            access_token = auth_service.create_access_token(user_data)
            refresh_token = auth_service.create_refresh_token(user.id)
            response = JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "Muvaffaqiyatli ro'yxatdan o'tdingiz",
                "access_token": access_token,
                "role": user.role
            }
        )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite="strict"
            )
            return response
        except EmailException as e:
            raise HTTPException(status_code=400, detail=str(e))

    async def refresh_token(self, token: str) -> dict:
        try:
            payload = await auth_service.verify_jwt_token(token, [TokenType.REFRESH])
            db_user = await self.user_repo.get_user_by_id(payload)
            if not db_user:
                raise HTTPException(
                    status_code=401, detail="Foydalanuvchi topilmadi"
                )
            token_data = UserResponse.model_validate(db_user).model_dump()
            access_token = auth_service.create_access_token(token_data)
            return JSONResponse(
                status_code=200,
                content={
                    "status": "success",
                    "message": "Token muvaffaqiyatli yangilandi",
                    "access_token": access_token
                }
            )
        except JWTException as e:
            raise HTTPException(status_code=401, detail=str(e))

    async def logout_user(self, refresh_token: str) -> RedirectResponse:
        await self.auth_repo.add_token_blacklist(refresh_token, TokenType.REFRESH)
        response = JSONResponse(
            status_code=200,
            content={
                "status": "success",
                "message": "Muvaffaqiyatli chiqdingiz"
            }
        )
        response.delete_cookie("refresh_token")
        return response

    async def user_me(self, request: Request) -> dict:
        user_id = await self._get_user_id(request)
        user = await self.user_repo.get_user_by_id(user_id)
        return UserResponse.model_validate(user).model_dump()
