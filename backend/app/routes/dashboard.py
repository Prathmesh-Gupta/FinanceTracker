from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from dependencies.database import get_db
from models.ExpenseModel import Expense
from models.AccountModel import Account

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


# ✅ SUMMARY CARDS
@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):

    total_balance = (
        db.query(func.coalesce(func.sum(Account.balance), 0))
        .filter(Account.user_id == DEMO_USER_ID)
        .scalar()
    )

    monthly_spend = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.user_id == DEMO_USER_ID,
            extract("month", Expense.expense_date) == extract("month", func.current_date()),
            extract("year", Expense.expense_date) == extract("year", func.current_date()),
            Expense.category.notin_(["Investment", "Savings"])
        )
        .scalar()
    )

    monthly_investment = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.user_id == DEMO_USER_ID,
            extract("month", Expense.expense_date) == extract("month", func.current_date()),
            extract("year", Expense.expense_date) == extract("year", func.current_date()),
            Expense.category == "Investment"
        )
        .scalar()
    )

    monthly_savings = (
        db.query(func.coalesce(func.sum(Expense.amount), 0))
        .filter(
            Expense.user_id == DEMO_USER_ID,
            extract("month", Expense.expense_date) == extract("month", func.current_date()),
            extract("year", Expense.expense_date) == extract("year", func.current_date()),
            Expense.category == "Savings"
        )
        .scalar()
    )

    return {
        "total_balance": float(total_balance),
        "monthly_spend": float(monthly_spend),
        "monthly_investment": float(monthly_investment),
        "monthly_savings": float(monthly_savings),
    }


# ✅ CATEGORY BREAKDOWN (Pie Chart)
@router.get("/category-breakdown")
def category_breakdown(db: Session = Depends(get_db)):

    rows = (
        db.query(
            Expense.category,
            func.sum(Expense.amount).label("total")
        )
        .filter(Expense.user_id == DEMO_USER_ID)
        .group_by(Expense.category)
        .all()
    )

    return [
        {
            "category": r.category,
            "total": float(abs(r.total))  # ✅ avoid negative slices
        }
        for r in rows
    ]


# ✅ MONTHLY TREND (Line Chart)
@router.get("/monthly-trend")
def monthly_trend(db: Session = Depends(get_db)):

    rows = (
        db.query(
            extract("year", Expense.expense_date).label("year"),
            extract("month", Expense.expense_date).label("month"),
            func.sum(Expense.amount).label("total")
        )
        .filter(Expense.user_id == DEMO_USER_ID)
        .group_by(
            extract("year", Expense.expense_date),
            extract("month", Expense.expense_date)
        )
        .order_by(
            extract("year", Expense.expense_date),
            extract("month", Expense.expense_date)
        )
        .all()
    )

    MONTH_MAP = {
        1: "Jan", 2: "Feb", 3: "Mar",
        4: "Apr", 5: "May", 6: "Jun",
        7: "Jul", 8: "Aug", 9: "Sep",
        10: "Oct", 11: "Nov", 12: "Dec"
    }

    return [
        {
            "month": MONTH_MAP.get(int(r.month)),  # ✅ short name
            "year": int(r.year),
            "total": float(abs(r.total))
        }
        for r in rows
    ]


# ✅ RECENT TRANSACTIONS
@router.get("/recent")
def recent_transactions(db: Session = Depends(get_db)):

    rows = (
        db.query(Expense)
        .filter(Expense.user_id == DEMO_USER_ID)
        .order_by(Expense.created_at.desc())
        .limit(5)
        .all()
    )

    return rows
