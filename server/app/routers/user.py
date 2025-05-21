from typing import Optional
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.enums import Roles
from app.schemas.user import UserCreate
from app.controllers.user import UserController
from app.database.session import get_async_session
from app.core.permission import permission_required
from app.database.models.user import User
from app.utils.hash import hash_password

router = APIRouter(prefix="/users", tags=["users"])


async def controller(db: AsyncSession = Depends(get_async_session)):
    return UserController(db)


@router.post("")
# @permission_required(Roles.MANAGER)
async def create_user(
        request: Request,
        user_in: UserCreate,
        controller: UserController = Depends(controller)
):
    return await controller.create_user(user_in)

@router.get("/create-manager")
async def create_manager(db: AsyncSession = Depends(get_async_session)):
    db_user = select(User).where(User.email == "admin@gmail.com")
    db_user = await db.execute(db_user)
    db_user = db_user.scalars().first()
    
    if db_user:
        return {"message": "Manager allaqachon ro'yxatdan o'tgan"}

    hashed_password = hash_password("admin")
    
    new_user = User(
        first_name="Admin",
        last_name="Admin",
        email="admin@gmail.com",
        hashed_password=hashed_password,
        role="manager",
    )
    db.add(new_user)
    
    await db.commit()
    
    return {"message": "Manager yaratildi"}


@router.get("")
# @permission_required(Roles.MANAGER)
async def list_users(
        request: Request,
        role: Optional[Roles]=None,
        controller: UserController = Depends(controller)
):
    return await controller.get_all_users(role)


@router.patch("/{user_id}")
# @permission_required([Roles.MANAGER, Roles.MASTER])
async def update_user(
        user_id: int,
        request: Request,
        role: Optional[Roles]=None,
        controller: UserController = Depends(controller)
):
    return await controller.update_user_role(user_id, role)
