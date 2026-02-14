from sqlalchemy import Column, String, Numeric, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from dependencies.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))

    name = Column(String, nullable=False)
    type = Column(String)
    balance = Column(Numeric(12,2), default=0)

    created_at = Column(TIMESTAMP, server_default=func.now())
