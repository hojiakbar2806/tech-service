from fastapi import HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.component import ComponentCreate, ComponentUpdate, ComponentResponse
from app.repositories.component import ComponentRepository


class ComponentController:
    def __init__(self, db: AsyncSession):
        self.component_repo = ComponentRepository(db)

    async def create_component(self, data: ComponentCreate) -> ComponentResponse:
        await self.component_repo.create(data.model_dump())
        return JSONResponse(content={"message": "Ehtiyot qism muvaffaqiyatli yaratildi",})

    async def get_all_components(self) -> list[ComponentResponse]:
        components = await self.component_repo.get_all()
        return [ComponentResponse.model_validate(component) for component in components]

    async def get_component(self, component_id: int) -> ComponentResponse:
        component = await self.component_repo.get_by_id(component_id)
        if not component:
            raise HTTPException(status_code=404, detail="Komponent topilmadi")
        return JSONResponse(content=ComponentResponse.model_validate(component))

    async def update_component(self, component_id: int, data: ComponentUpdate) -> ComponentResponse:
        component = await self.component_repo.update(component_id, data.model_dump(exclude_unset=True))
        if not component:
            raise HTTPException(status_code=404, detail="Komponent topilmadi")
        return JSONResponse(content={"message": "Komponent muvaffaqiyatli yangilandi"})

    async def delete_component(self, component_id: int) -> dict:
        deleted = await self.component_repo.delete(component_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Komponent topilmadi")
        return JSONResponse(content={"message": "Komponent muvaffaqiyatli o'chirildi"})
