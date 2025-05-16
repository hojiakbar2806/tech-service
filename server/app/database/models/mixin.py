from sqlalchemy import Column, Integer, String, Enum

from app.database.base import Base
from app.core.enums import TokenType


class BlacklistedToken(Base):
    __tablename__ = "blacklisted_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, nullable=False)
    type = Column(Enum(TokenType), nullable=False)
