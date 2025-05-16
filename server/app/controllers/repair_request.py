from fastapi import Request
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.utils.response import response as res
from app.controllers.auth import AuthController
from app.repositories.user import UserRepository
from app.core.exceptions import ResourceNotFoundException
from app.repositories.repair_request import RepairRequestRepository
from app.schemas.repair_request import RepairRequestCreate, RepairRequestUpdate, RepairRequestResponse


class RepairRequestController:
    def __init__(self, db: AsyncSession):
        self.repair_request_repo = RepairRequestRepository(db)
        self.user_repo = UserRepository(db)
        self.auth_controller = AuthController(db)

    async def create(self, request: Request, data_in: RepairRequestCreate):
        owner_id = getattr(request.state, "user").get("id")
        data = data_in.model_dump()
        data["owner_id"] = owner_id
        await self.repair_request_repo.create_request(data)
        return res.success("So'rovnoma muvaffaqiyatli yaratildi")

    async def partial_update(self, id: int, data_in: RepairRequestUpdate):
        try:
            if data_in.master_id:
                db_user = await self.user_repo.get_master_by_id(data_in.master_id)
                print(db_user)
                if db_user is None:
                    raise res.bad_request("Master topilmadi")
            await self.repair_request_repo.partial_update(id, data_in.model_dump())
            return res.success("So'rovnoma muvaffaqiyatli yangilandi")
        except ResourceNotFoundException as e:
            raise res.bad_request(str(e))

    async def get_repair_request(self, id: int):
        try:
            request = await self.repair_request_repo.get_by_id(id)
            return RepairRequestResponse.model_validate(request)
        except ResourceNotFoundException as e:
            raise res.bad_request(str(e))

    async def get_all(self) -> List[RepairRequestResponse]:
        request = await self.repair_request_repo.get_all()
        return [RepairRequestResponse.model_validate(req) for req in request]

    async def get_my_repair_requests(self, request: Request) -> List[RepairRequestResponse]:
        user_id = getattr(request.state, "user").get("id")
        repair_requests = await self.repair_request_repo.get_by_owner_id(user_id)
        return repair_requests
