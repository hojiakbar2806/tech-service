from sqlalchemy.orm import relationship
from sqlalchemy import Boolean, Column, Integer, String, Enum

from app.database.base import Base
from app.core.enums import Roles


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    company_name = Column(String, nullable=True, default=None)
    is_legal_entity = Column(Boolean, default=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    role = Column(Enum(Roles), nullable=False, default=Roles.USER)

    requests = relationship(
        "RepairRequest",
        back_populates="owner",
        foreign_keys="[RepairRequest.owner_id]"
    )

    assigned_requests = relationship(
        "RepairRequest",
        back_populates="master",
        foreign_keys="[RepairRequest.master_id]"
    )

    sent_notifications = relationship(
        "Notification",
        back_populates="sender",
        foreign_keys="[Notification.sender_id]"
    )

    received_notifications = relationship(
        "Notification",
        back_populates="receiver",
        foreign_keys="[Notification.receiver_id]"
    )
