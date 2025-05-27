from sqlalchemy import Column, Integer, ForeignKey
from app.database.base import Base
from sqlalchemy.orm import relationship


class RepairRequestComponent(Base):
    __tablename__ = "repair_request_components"

    repair_request_id = Column(ForeignKey(
        "repair_requests.id", ondelete="CASCADE"), primary_key=True
    )
    component_id = Column(ForeignKey(
        "components.id", ondelete="CASCADE"), primary_key=True
    )
    quantity = Column(Integer, nullable=False, default=1)

    repair_request = relationship(
        "RepairRequest", back_populates="component_links"
    )
    component = relationship(
        "Component", back_populates="repair_request_links"
    )
