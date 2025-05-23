from typing import Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.enums import Roles
from app.schemas.user import UserCreate,PartialUpdateUser
from app.controllers.user import UserController
from app.database.session import get_async_session
from app.core.permission import permission_required
from app.database.models.user import User
from app.utils.hash import hash_password

router = APIRouter(prefix="/users", tags=["users"])


async def controller(db: AsyncSession = Depends(get_async_session)):
    return UserController(db)


@router.post("")
@permission_required(Roles.MANAGER)
async def create_user(
        request: Request,
        user_in: UserCreate,
        controller: UserController = Depends(controller)
):
    return await controller.create_user(user_in)


@router.get("/create")
async def create(db: AsyncSession = Depends(get_async_session)):
    users_to_create = [
        {
            "first_name": "Manager",
            "last_name": "Manager",
            "email": "manager@gmail.com",
            "password": "manager",
            "role": "manager"
        },
        {
            "first_name": "Master",
            "last_name": "Master",
            "email": "master@gmail.com",
            "password": "master",
            "role": "master"
        },
        {
            "first_name": "User",
            "last_name": "User",
            "email": "user@gmail.com",
            "password": "user",
            "role": "user"
        }
    ]

    messages = []

    for user_data in users_to_create:
        stmt = select(User).where(User.email == user_data["email"])
        result = await db.execute(stmt)
        existing_user = result.scalars().first()

        if existing_user:
            messages.append(
                f"{user_data['role'].capitalize()} allaqachon ro'yxatdan o'tgan")
            continue

        hashed_pwd = hash_password(user_data["password"])
        new_user = User(
            first_name=user_data["first_name"],
            last_name=user_data["last_name"],
            email=user_data["email"],
            hashed_password=hashed_pwd,
            role=user_data["role"]
        )
        db.add(new_user)
        messages.append(f"{user_data['role'].capitalize()} yaratildi")

    await db.commit()

    return {"messages": messages}


@router.patch("")
@permission_required()
async def update_user(
        request: Request,
        data_in: PartialUpdateUser,
        controller: UserController = Depends(controller)
):
    return await controller.partial_update_user(request, data_in)


@router.get("")
@permission_required(Roles.MANAGER)
async def list_users(
        request: Request,
        role: Optional[Roles] = None,
        controller: UserController = Depends(controller)
):
    return await controller.get_all_users(role)


@router.patch("/{user_id}")
@permission_required([Roles.MANAGER, Roles.MASTER])
async def update_user(
        user_id: int,
        request: Request,
        role: Optional[Roles] = None,
        controller: UserController = Depends(controller)
):
    return await controller.update_user_role(user_id, role)
