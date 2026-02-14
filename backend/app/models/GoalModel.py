from sqlalchemy import Column, String, Numeric, Date, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from dependencies.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))

    title = Column(String)
    target_amount = Column(Numeric(12,2), nullable=False)
    target_date = Column(Date)

    created_at = Column(TIMESTAMP, server_default=func.now())
