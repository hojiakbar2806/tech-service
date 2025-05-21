from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.schemas.user import UserResponse


class NotificationCreate(BaseModel):
    title: str
    message: str
    receiver_id: int


class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    sender: Optional[UserResponse]
    receiver: Optional[UserResponse]
    request_id: Optional[int] = None
    created_at: datetime
    for_action: Optional[str] = None
    updated_at: datetime
    seen: bool

    model_config = ConfigDict(from_attributes=True)
