from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field
from app.core.enums import Roles


class UserCreate(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: str = Field(...)
    hashed_password: str = Field(..., alias="password")
    role: Optional[Roles]


class UserUpdate(BaseModel):
    first_name: str = Field(None, min_length=2)
    last_name: str = Field(None, min_length=2)
    email: str = Field(None)
    hashed_password: str = Field(None, alias="password")


class PartialUpdateUser(BaseModel):
    first_name: str = Field(None, min_length=2)
    last_name: str = Field(None, min_length=2)
    email: str = Field(None)
    hashed_password: str = Field(None, alias="new_password")
    old_password: str = Field(None)


class UserResponse(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: str
    role: Roles
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        use_enum_values = True
