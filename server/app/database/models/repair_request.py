import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DateTime, Float

from app.database.base import Base
from app.core.enums import RequestStatus, IssueType


class RepairRequest(Base):
    __tablename__ = "repair_requests"

    id = Column(Integer, primary_key=True, index=True)
    device_model = Column(String, nullable=False)
    issue_type = Column(Enum(IssueType), nullable=False)
    problem_area = Column(String, nullable=False)
    description = Column(String, nullable=False)
    location = Column(String, nullable=True)
    status = Column(Enum(RequestStatus), default=RequestStatus.CREATED)
    end_time = Column(DateTime(timezone=True), nullable=True)
    price = Column(Float, nullable=True)

    owner_id = Column(Integer, ForeignKey(
        "users.id", ondelete="CASCADE"), nullable=False
    )
    master_id = Column(Integer, ForeignKey(
        "users.id", ondelete="SET NULL"), nullable=True
    )

    owner = relationship(
        "User", back_populates="requests",
        foreign_keys=[owner_id], passive_deletes=True
    )
    master = relationship(
        "User", back_populates="assigned_requests",
        foreign_keys=[master_id], passive_deletes=True
    )

    component_links = relationship(
        "RepairRequestComponent",
        back_populates="repair_request",
        cascade="all, delete-orphan"
    )
    components = relationship(
        "Component",
        secondary="repair_request_components",
        viewonly=True
    )
