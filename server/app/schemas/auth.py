from pydantic import BaseModel, Field
from typing import Optional

from app.schemas.user import UserCreate


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserRegisterRequest(BaseModel):
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    is_legal_entity: Optional[bool]
    company_name: Optional[str]
    email: str = Field(...)
    hashed_password: str = Field(..., alias="password")


