from typing import Optional
from pydantic import BaseModel, ConfigDict
from datetime import datetime

from app.core.enums import IssueType, RequestStatus
from app.schemas.user import UserResponse


class RepairRequestCreate(BaseModel):
    device_model: str
    issue_type: IssueType
    problem_area: str
    description: str
    location: str


class RepairRequestUpdate(BaseModel):
    master_id: Optional[int] = None
    status: Optional[RequestStatus] = None
    end_time: Optional[datetime] = None
    price: Optional[float] = None


class RepairRequestResponse(BaseModel):
    id: int
    owner_id: int
    master_id: Optional[int] = None
    device_model: str
    issue_type: IssueType
    problem_area: str
    description: str
    location: str
    price: Optional[float] = None
    master: Optional[UserResponse] = None
    status: RequestStatus
    end_time: Optional[datetime] = None
    estimated_completion: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
