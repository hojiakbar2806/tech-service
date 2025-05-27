from app.database.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, Float


class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(String, nullable=True)
    in_stock = Column(Integer, default=0)
    price = Column(Float, nullable=True)

    repair_request_links = relationship(
        "RepairRequestComponent",
        back_populates="component"
    )
