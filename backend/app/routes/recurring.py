from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from typing import Optional
import uuid

from dependencies.database import get_db
from models.RecurringTransModel import RecurringTransaction

router = APIRouter(prefix="/recurring", tags=["Recurring"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


# ✅ CREATE RECURRING (goal_id optional / nullable)
@router.post("/")
def create_recurring(payload: dict = Body(...), db: Session = Depends(get_db)):

    today = date.today()

    user_id = payload.get("user_id") or DEMO_USER_ID
    account_id = payload.get("account_id")

    title = payload.get("title")
    amount = payload.get("amount")
    category = payload.get("category")

    if title is None or amount is None or category is None:
        raise HTTPException(status_code=400, detail="title, amount, category required")

    start_date = payload.get("start_date") or today
    next_due_date = payload.get("next_due_date") or today

    recurring = RecurringTransaction(
        id=uuid.uuid4(),
        user_id=user_id,
        account_id=account_id,
        goal_id=payload.get("goal_id"),  # ✅ can be NULL
        title=title,
        amount=amount,
        category=category,
        frequency=payload.get("frequency", "monthly"),
        start_date=start_date,
        next_due_date=next_due_date,
        is_active=True
    )

    db.add(recurring)
    db.commit()
    db.refresh(recurring)

    return recurring


# ✅ EXECUTE ENGINE
from services.recurring_engine import execute_recurring_transactions

@router.post("/execute")
def run_recurring_engine(db: Session = Depends(get_db)):
    results = execute_recurring_transactions(db)
    return {
        "message": "Recurring engine executed",
        "results": results
    }


# ✅ INVESTMENT / SAVINGS RECURRINGS (FIXED FILTER)
from typing import Optional
from fastapi import Body

@router.put("/{txn_id}")
def update_recurring(
    txn_id: UUID,
    title: Optional[str] = Body(None),
    amount: Optional[float] = Body(None),
    category: Optional[str] = Body(None),
    next_due_date: Optional[date] = Body(None),
    is_active: Optional[bool] = Body(None),
    goal_id: Optional[UUID] = Body(None),
    db: Session = Depends(get_db)
):
    txn = db.query(RecurringTransaction).filter(RecurringTransaction.id == txn_id).first()

    if not txn:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")

    if title is not None:
        txn.title = title

    if amount is not None:
        txn.amount = amount

    if category is not None:
        txn.category = category

    if next_due_date is not None:
        txn.next_due_date = next_due_date

    if is_active is not None:
        txn.is_active = is_active

        

    db.commit()
    db.refresh(txn)

    return txn




# ✅ DELETE
@router.delete("/{txn_id}")
def delete_recurring(txn_id: UUID, db: Session = Depends(get_db)):
    txn = db.query(RecurringTransaction).filter(RecurringTransaction.id == txn_id).first()

    if not txn:
        raise HTTPException(status_code=404, detail="Recurring transaction not found")

    db.delete(txn)
    db.commit()

    return {"message": "Recurring transaction deleted ✅"}



# @router.get("/{txn_id}")
# def get_recurring(txn_id: UUID, db: Session = Depends(get_db)):
#     txn = db.query(RecurringTransaction).filter(RecurringTransaction.id == txn_id).first()
#     if not txn:
#         raise HTTPException(status_code=404, detail="Recurring transaction not found")
#     return txn


@router.get("/investments")
def get_investment_recurrings(db: Session = Depends(get_db)):
    return (
        db.query(RecurringTransaction)
        .filter(RecurringTransaction.category.in_(["Investment", "Savings", "Saving"]))
        .all()
    )