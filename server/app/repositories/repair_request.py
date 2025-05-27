from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.exceptions import ResourceNotFoundException
from app.database.models.component import Component
from app.database.models.repair_request import RepairRequest
from app.database.models.repair_request_component import RepairRequestComponent
from app.core.enums import RequestStatus


class RepairRequestRepository:
    def __init__(self, db: Session):
        self.db = db

    async def create_request(self, request: dict, refresh: bool = False) -> RepairRequest:
        new_request = RepairRequest(**request)
        self.db.add(new_request)
        await self.db.commit()
        if refresh:
            await self.db.refresh(new_request)
        return new_request

    async def get_by_id(self, id: int) -> Optional[RepairRequest]:
        stmt = select(RepairRequest).where(
            RepairRequest.id == id
        ).options(
            selectinload(RepairRequest.master),
            selectinload(RepairRequest.owner),
            selectinload(RepairRequest.component_links).selectinload(
                RepairRequestComponent.component)
        )
        result = await self.db.execute(stmt)
        db_request = result.scalar_one_or_none()
        if db_request is None:
            raise ResourceNotFoundException("RepairRequest", id)
        return db_request

    async def get_all(self, status: Optional[RequestStatus] = None) -> list[RepairRequest]:
        stmt = select(RepairRequest).options(
            selectinload(RepairRequest.master),
            selectinload(RepairRequest.owner)
        ).order_by(RepairRequest.created_at.desc())
        if status:
            stmt = stmt.where(RepairRequest.status == status)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_owner_id(self, owner_id: int) -> list[RepairRequest]:
        stmt = select(RepairRequest).where(
            RepairRequest.owner_id == owner_id
        ).options(
            selectinload(RepairRequest.master),
            selectinload(RepairRequest.owner)
        ).order_by(RepairRequest.created_at.desc())
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_master_id(self, master_id: int) -> list[RepairRequest]:
        stmt = select(RepairRequest).where(
            RepairRequest.master_id == master_id
        ).options(
            selectinload(RepairRequest.master),
            selectinload(RepairRequest.owner)
        ).order_by(RepairRequest.created_at.desc())
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def partial_update(self, id: int, updated_data: dict) -> RepairRequest:
        request_obj = await self.get_by_id(id)
        if request_obj is None:
            raise ResourceNotFoundException("RepairRequest", id)

        for key, value in updated_data.items():
            if key != "id" and hasattr(request_obj, key) and value is not None:
                setattr(request_obj, key, value)

        await self.db.commit()
        await self.db.refresh(request_obj)
        return request_obj

    async def delete_request(self, id: int) -> None:
        request_obj = await self.get_by_id(id)
        if request_obj is None:
            raise ResourceNotFoundException("RepairRequest", id)
        await self.db.delete(request_obj)
        await self.db.commit()

    async def attach_components_to_request(self, request_id: int, components_data: list[dict]) -> Optional[RepairRequest]:
        request = await self.get_by_id(request_id)
        if not request:
            return None

        request.component_links.clear()

        for item in components_data:
            component_id = item.get("component_id")
            stmt = select(Component).where(Component.id == component_id)
            result = await self.db.execute(stmt)
            component = result.scalar_one_or_none()
            if component:
                quantity = item.get("quantity", 1)

                if component.in_stock < quantity:
                    raise Exception(
                        f"'{component.name}' komponenti omborda yetarli emas. Mavjud: {component.in_stock}, kerak: {quantity}")

                component.in_stock -= quantity

                link = RepairRequestComponent(
                    component=component,
                    quantity=quantity
                )
                request.component_links.append(link)

        await self.db.commit()
        await self.db.refresh(request)
        return request
