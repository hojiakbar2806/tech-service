from sqlalchemy import Column, Integer, String, Enum, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from app.database.base import Base
from app.core.enums import TokenType


class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, nullable=False)
    type = Column(Enum(TokenType), nullable=False)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    seen = Column(Boolean, default=False)
    for_action = Column(String, nullable=True, default=None)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    request_id = Column(Integer, ForeignKey(
        "repair_requests.id", ondelete="SET NULL"), nullable=True)

    sender = relationship(
        "User", back_populates="sent_notifications",
        foreign_keys=[sender_id], passive_deletes=True
    )
    receiver = relationship(
        "User", back_populates="received_notifications",
        foreign_keys=[receiver_id], passive_deletes=True
    )
