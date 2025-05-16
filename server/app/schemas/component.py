from pydantic import BaseModel
from typing import Optional


class ComponentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    in_stock: int = 0
    price: Optional[float] = None


class ComponentUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    in_stock: Optional[int]
    price: Optional[float]


class ComponentResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    in_stock: int
    price: Optional[float]

    class Config:
        from_attributes = True
