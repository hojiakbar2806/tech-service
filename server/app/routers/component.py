from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_async_session
from app.controllers.component import ComponentController
from app.schemas.component import ComponentCreate, ComponentResponse, ComponentUpdate

router = APIRouter(prefix="/components", tags=["Components"])


async def controller(db: AsyncSession = Depends(get_async_session)) -> ComponentController:
    return ComponentController(db)


@router.post("/", response_model=ComponentResponse)
async def create_component(
    component_in: ComponentCreate,
    controller: ComponentController = Depends(controller),
):
    return await controller.create_component(component_in)


@router.get("/", response_model=List[ComponentResponse])
async def list_components(
    controller: ComponentController = Depends(controller),
):
    return await controller.get_all_components()


@router.patch("/{component_id}", response_model=ComponentResponse)
async def update_component(
    component_id: int,
    updated_data: ComponentUpdate,
    controller: ComponentController = Depends(controller),
):
    return await controller.update_component(component_id, updated_data)
