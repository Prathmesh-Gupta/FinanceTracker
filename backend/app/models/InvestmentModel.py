import uuid
from sqlalchemy import Column, String, Date, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from dependencies.database import Base

class Investment(Base):
    __tablename__ = "investments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    goal_id = Column(UUID(as_uuid=True), ForeignKey("goals.id", ondelete="SET NULL"))

    title = Column(String, nullable=False)
    type = Column(String)
    amount = Column(Numeric(12,2), nullable=False)

    investment_date = Column(Date, nullable=False)

    # ✅ NEW FIELDS
    source = Column(String, default="MANUAL")
    recurring_id = Column(UUID(as_uuid=True), nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
