from pydantic import BaseModel

from app.schemas.user import UserCreate


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserRegisterRequest(UserCreate):
    pass
