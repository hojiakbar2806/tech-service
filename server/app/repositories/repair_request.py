from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.database.models.repair_request import RepairRequest
from sqlalchemy.orm import selectinload


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
            selectinload(RepairRequest.master)
        )
        result = await self.db.execute(stmt)
        db_request = result.scalar_one_or_none()
        if db_request is None:
            raise ResourceNotFoundException("RepairRequest", id)
        return db_request

    async def get_all(self) -> list[RepairRequest]:
        stmt = select(RepairRequest).options(
            selectinload(RepairRequest.master)
        )
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_owner_id(self, owner_id: int) -> list[RepairRequest]:
        stmt = select(RepairRequest).where(
            RepairRequest.owner_id == owner_id
        ).options(
            selectinload(RepairRequest.master)
        )
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
        request_obj = self.get_by_id(id)
        if request_obj is None:
            raise ResourceNotFoundException("RepairRequest", id)
        self.db.delete(request_obj)
        self.db.commit()
