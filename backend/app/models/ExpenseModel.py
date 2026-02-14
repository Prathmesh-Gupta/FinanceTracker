from sqlalchemy import Column, String, Numeric, ForeignKey, Date, Boolean, TIMESTAMP, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from dependencies.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id", ondelete="SET NULL"))

    amount = Column(Numeric(12,2), nullable=False)
    category = Column(String)
    payment_method = Column(String)
    expense_date = Column(Date, nullable=False)
    notes = Column(Text)

    is_auto_generated = Column(Boolean, default=False)

    created_at = Column(TIMESTAMP, server_default=func.now())
