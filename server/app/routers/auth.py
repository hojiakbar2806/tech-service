from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Cookie, Depends, Form, HTTPException, Request

from app.controllers.auth import AuthController
from app.schemas.auth import UserRegisterRequest
from app.database.session import get_async_session
from app.core.permission import permission_required

router = APIRouter(prefix="/auth", tags=["Auth"])


async def controller(db: AsyncSession = Depends(get_async_session)):
    return AuthController(db)


@router.post("/send-auth-link")
async def send_auth_link(
    email: str = Form(..., min_length=3),
    controller: AuthController = Depends(controller)
):
    return await controller.send_auth_link(email)


@router.post("/verify/{token}")
async def verify_auth_link(token: str, controller: AuthController = Depends(controller)):
    return await controller.verify_auth_link(token)


@router.post("/login")
async def login_user(
    username: str = Form(..., min_length=4),
    password: str = Form(..., min_length=4),
    controller: AuthController = Depends(controller)
):
    return await controller.login(username, password)


@router.post("/register")
async def register_user(
    data_in: UserRegisterRequest,
    controller: AuthController = Depends(controller)
):
    return await controller.register(data_in)


@router.post("/refresh-token")
async def refresh_token(
    request: Request,
    refresh_token: str = Cookie(None),
    controller: AuthController = Depends(controller)
):
    return await controller.refresh_token(refresh_token)


@router.get("/me")
@permission_required()
async def user_me(request: Request, controller: AuthController = Depends(controller)):
    return await controller.user_me(request)


@router.post("/logout")
async def logout_user(
    refresh_token: str = Cookie(None),
    controller: AuthController = Depends(controller)
):
    if not refresh_token:
        return HTTPException(status_code=400, detail="Refresh token not found")
    return await controller.logout_user(refresh_token)
