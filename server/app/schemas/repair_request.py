from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, EmailStr
from datetime import datetime

from app.core.enums import IssueType, RequestStatus
from app.schemas.user import UserResponse


class UserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    hashed_password: Optional[str] = Field(None, alias="password")


class RepairRequestCreate(BaseModel):
    device_model: str
    issue_type: IssueType
    problem_area: str
    description: str
    location: str


class RepairRequestWithUserRequest(BaseModel):
    repair_request: RepairRequestCreate
    user_data: UserRequest


class Component(BaseModel):
    id: int
    quantity: int


class PersonalizedRepairRequest(BaseModel):
    price: int
    end_date: datetime
    components: List[Component]


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
    owner: Optional[UserResponse] = None
    status: RequestStatus
    end_time: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
