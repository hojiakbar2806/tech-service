from typing import List
from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.core.enums import Roles
from app.core.enums import RequestStatus
from app.database.session import get_async_session
from app.core.permission import permission_required
from app.controllers.repair_request import RepairRequestController
from app.schemas.repair_request import (
    RepairRequestUpdate,
    RepairRequestCreate,
    RepairRequestResponse,
    PersonalizedRepairRequest,
    RepairRequestWithUserRequest
)

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
    status: Optional[RequestStatus] = None,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.get_all(status)


@router.get("/me", response_model=List[RepairRequestResponse])
@permission_required()
async def list_my_repair_requests(
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.get_my_repair_requests(request)


@router.get("/master", response_model=List[RepairRequestResponse])
@permission_required([Roles.MASTER])
async def list_master_repair_requests(
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.get_master_repair_requests(request)


@router.patch("/{id}/as-completed")
@permission_required([Roles.MASTER])
async def set_as_completed(
    id: int,
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.set_as_completed(id, request)


@router.post("/create-with-user")
async def create_repair_request(
    data_in: RepairRequestWithUserRequest,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.create_request_with_user(data_in)


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


@router.post("/{id}/as-checked")
@permission_required([Roles.MANAGER])
async def set_as_checking(
    id: int,
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.set_as_checked(id, request)


@router.post("/{id}/as-rejected")
@permission_required([Roles.MANAGER])
async def set_as_rejected(
    id: int,
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.set_as_rejected(id, request)


@router.post("/{id}/as-in-progress")
@permission_required([Roles.USER])
async def set_as_rejected(
    id: int,
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.set_as_in_progress(id, request)


@router.patch("/{id}/as-approved")
@permission_required([Roles.USER])
async def set_as_approved(
    id: int,
    request: Request,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.set_as_approved(id, request)


@router.patch("/{id}/personalize-order")
@permission_required([Roles.MASTER])
async def set_as_completed(
    id: int,
    request: Request,
    data_in: PersonalizedRepairRequest,
    controller: RepairRequestController = Depends(controller)
):
    return await controller.personalize_order(id, data_in, request)
