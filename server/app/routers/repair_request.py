from typing import List
from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.enums import Roles
from app.database.session import get_async_session
from app.core.permission import permission_required
from app.controllers.repair_request import RepairRequestController
from app.schemas.repair_request import RepairRequestResponse, RepairRequestCreate, RepairRequestUpdate

router = APIRouter(prefix="/repair-requests", tags=["Repair Requests"])


async def controller(db: AsyncSession = Depends(get_async_session)):
    return RepairRequestController(db)


@router.post("")
@permission_required()
async def new_repair_request(
    request: Request,
    data_in: RepairRequestCreate,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.create(request, data_in)


@router.get("", response_model=List[RepairRequestResponse])
@permission_required()
async def list_repair_requests(
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.get_all()


@router.get("/me", response_model=List[RepairRequestResponse])
@permission_required()
async def list_my_repair_requests(
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.get_my_repair_requests(request)


@router.get("/{id}", response_model=RepairRequestResponse)
@permission_required([Roles.MANAGER, Roles.MASTER])
async def get_repair_request(
    id: int,
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.get_repair_request(id)


@router.patch("/{id}")
@permission_required([Roles.MANAGER, Roles.MASTER])
async def update_repair_request(
    id: int,
    request: Request,
    data_in: RepairRequestUpdate,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.partial_update(id, data_in)
