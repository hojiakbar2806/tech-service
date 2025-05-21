from typing import List
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_async_session
from app.controllers.notification import NotificationController
from app.schemas.notification import NotificationResponse, NotificationCreate
from app.core.permission import permission_required

router = APIRouter(prefix="/notifications", tags=["Notifications"])


async def controller(db: AsyncSession = Depends(get_async_session)) -> NotificationController:
    return NotificationController(db)


@router.get("")
@permission_required()
async def list_components(
    request: Request,
    controller: NotificationController = Depends(controller),
):
    return await controller.get_my_notifications(request)


@router.post("")
@permission_required()
async def list_components(
    request: Request,
    data_in: NotificationCreate,
    controller: NotificationController = Depends(controller),
):
    return await controller.send_notification(data_in, request)


@router.post("/send")
async def send_notification(
    request: Request,
    data_in: NotificationCreate,
    controller: NotificationController = Depends(controller),
):
    return await controller.send_notification(data_in, request)


@router.post("/as-read")
async def send_notification(
    request: Request,
    data_in: List[int],
    controller: NotificationController = Depends(controller),
):
    return await controller.set_as_read(data_in)
