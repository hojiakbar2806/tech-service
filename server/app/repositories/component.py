from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database.models.component import Component


class ComponentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: dict) -> Component:
        component = Component(**data)
        self.db.add(component)
        await self.db.commit()
        await self.db.refresh(component)
        return component

    async def get_all(self) -> list[Component]:
        result = await self.db.execute(select(Component))
        return result.scalars().all()

    async def get_by_id(self, component_id: int) -> Component | None:
        result = await self.db.execute(select(Component).where(Component.id == component_id))
        return result.scalars().first()

    async def update(self, component_id: int, updated_data: dict) -> Component | None:
        component = await self.get_by_id(component_id)
        if not component:
            return None

        for key, value in updated_data.items():
            if hasattr(component, key) and value is not None:
                setattr(component, key, value)

        await self.db.commit()
        await self.db.refresh(component)
        return component

    async def delete(self, component_id: int) -> bool:
        component = await self.get_by_id(component_id)
        if not component:
            return False

        await self.db.delete(component)
        await self.db.commit()
        return True
