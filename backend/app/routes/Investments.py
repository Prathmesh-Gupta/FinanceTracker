from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from dependencies.database import get_db
from models.ExpenseModel import Expense

router = APIRouter(prefix="/investments", tags=["Investments"])


# ✅ HISTORY FROM EXPENSES
@router.get("/history")
def investment_history(db: Session = Depends(get_db)):
    return (
        db.query(Expense)
        .filter(Expense.category.in_(["Investment", "Savings", "Saving"]))
        .order_by(Expense.expense_date.desc())
        .all()
    )
