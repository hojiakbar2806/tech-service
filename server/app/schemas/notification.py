from pydantic import BaseModel

from app.schemas.user import UserResponse


class NotificationCreate(BaseModel):
    title: str
    message: str
    receiver_id: int

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    sender: UserResponse
    receiver: UserResponse