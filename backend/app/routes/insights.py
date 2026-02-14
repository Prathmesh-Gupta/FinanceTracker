from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime

from dependencies.database import SessionLocal
from models.ExpenseModel import Expense

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/insights")
def get_insights(db: Session = Depends(get_db)):

    current_month = datetime.now().month

    # ✅ Total spending
    total_spending = db.query(
        func.coalesce(func.sum(Expense.amount), 0)
    ).scalar()

    # ✅ This month spending
    this_month = db.query(
        func.coalesce(func.sum(Expense.amount), 0)
    ).filter(
        extract("month", Expense.expense_date) == current_month
    ).scalar()

    # ✅ Top category
    top_category_row = db.query(
        Expense.category,
        func.sum(Expense.amount).label("total")
    ).group_by(
        Expense.category
    ).order_by(
        func.sum(Expense.amount).desc()
    ).first()

    top_category = top_category_row[0] if top_category_row else None

    # ✅ Monthly trend
    monthly_data = db.query(
        extract("month", Expense.expense_date).label("month"),
        func.sum(Expense.amount).label("amount")
    ).group_by(
        extract("month", Expense.expense_date)
    ).order_by(
        extract("month", Expense.expense_date)
    ).all()

    monthly_trend = [
        {
            "month": datetime(1900, int(row.month), 1).strftime("%b"),
            "amount": float(row.amount)
        }
        for row in monthly_data
    ]

    return {
        "summary": {
            "total_spending": float(total_spending),
            "top_category": top_category,
            "this_month": float(this_month),
        },
        "monthly_trend": monthly_trend,
    }
