from sqlalchemy import Column, String, Numeric, ForeignKey, Date, Boolean, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from dependencies.database import Base

class RecurringTransaction(Base):
    __tablename__ = "recurring_transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id", ondelete="SET NULL"))

    title = Column(String, nullable=False)
    amount = Column(Numeric(12,2), nullable=False)
    category = Column(String)

    frequency = Column(String, default="monthly")
    start_date = Column(Date, nullable=False)
    next_due_date = Column(Date, nullable=False)

    is_active = Column(Boolean, default=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    goal_id = Column(
        UUID(as_uuid=True),
        ForeignKey("goals.id", ondelete="SET NULL"),
        nullable=True
    )
