from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date
from decimal import Decimal


from dependencies.database import get_db
from models.ExpenseModel import Expense
from models.AccountModel import Account

router = APIRouter(prefix="/expenses", tags=["Expenses"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


# ✅ CREATE EXPENSE
@router.post("/")
def create_expense(
    amount: float,
    category: str,
    payment_method: str,
    expense_date: date,
    notes: str = "",
    account_id: UUID | None = None,
    db: Session = Depends(get_db)
):
    account = None

    if account_id:
        account = db.query(Account).filter(Account.id == account_id).first()
        if not account:
            raise HTTPException(status_code=404, detail="Account not found")

    amt = Decimal(str(amount))   # ✅ IMPORTANT

    expense = Expense(
        amount=amt,              # ✅ store Decimal (cleaner)
        category=category,
        payment_method=payment_method,
        expense_date=expense_date,
        notes=notes,
        account_id=account_id,
        user_id=DEMO_USER_ID
    )

    db.add(expense)

    if account:
        account.balance -= amt   # ✅ Decimal-safe

    db.commit()
    db.refresh(expense)

    return expense




# ✅ GET ALL EXPENSES
@router.get("/")
def get_expenses(db: Session = Depends(get_db)):
    return db.query(Expense).all()


# ✅ GET SINGLE EXPENSE
@router.get("/{expense_id}")
def get_expense(expense_id: UUID, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    return expense


# ✅ UPDATE EXPENSE
@router.put("/{expense_id}")
def update_expense(
    expense_id: UUID,
    title: str,  # ✅ FIXED
    amount: float,
    category: str,
    payment_method: str,
    expense_date: date,
    notes: str = "",
    db: Session = Depends(get_db)
):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    account = None

    # ✅ Fetch linked account
    if expense.account_id:
        account = db.query(Account).filter(Account.id == expense.account_id).first()

    # ✅ Revert old balance deduction
    if account:
        account.balance += expense.amount

    # ✅ Apply updates
    expense.title = title
    expense.amount = amount
    expense.category = category
    expense.payment_method = payment_method
    expense.expense_date = expense_date
    expense.notes = notes

    # ✅ Deduct new amount
    # if account:
    #     account.balance -= amount

    if account:
        account.balance -= Decimal(str(amount))


    db.commit()
    db.refresh(expense)

    return expense


# ✅ DELETE EXPENSE
@router.delete("/{expense_id}")
def delete_expense(expense_id: UUID, db: Session = Depends(get_db)):
    expense = db.query(Expense).filter(Expense.id == expense_id).first()

    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    # ✅ Restore balance if linked
    if expense.account_id:
        account = db.query(Account).filter(Account.id == expense.account_id).first()
        if account:
            account.balance += expense.amount

    db.delete(expense)
    db.commit()

    return {"message": "Expense deleted ✅"}




# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from uuid import UUID
# from datetime import date

# from dependencies.database import get_db
# from models.ExpenseModel import Expense

# router = APIRouter(prefix="/expenses", tags=["Expenses"])

# DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"

# @router.post("/")
# def create_expense(
#     amount: float,
#     category: str,
#     payment_method: str,
#     expense_date: date,
#     notes: str = "",
#     account_id: UUID | None = None,
#     db: Session = Depends(get_db)
# ):
#     expense = Expense(
#         amount=amount,
#         category=category,
#         payment_method=payment_method,
#         expense_date=expense_date,
#         notes=notes,
#         account_id=account_id,
#         user_id=DEMO_USER_ID
#     )

#     db.add(expense)
#     db.commit()
#     db.refresh(expense)

#     return expense



# @router.get("/")
# def get_expenses(db: Session = Depends(get_db)):
#     return db.query(Expense).all()



# @router.get("/{expense_id}")
# def get_expense(expense_id: UUID, db: Session = Depends(get_db)):
#     expense = db.query(Expense).filter(Expense.id == expense_id).first()

#     if not expense:
#         raise HTTPException(status_code=404, detail="Expense not found")

#     return expense




# @router.put("/{expense_id}")
# def update_expense(
#     expense_id: UUID,
#     amount: float,
#     category: str,
#     payment_method: str,
#     expense_date: date,
#     notes: str = "",
#     db: Session = Depends(get_db)
# ):
#     expense = db.query(Expense).filter(Expense.id == expense_id).first()

#     if not expense:
#         raise HTTPException(status_code=404, detail="Expense not found")

#     expense.amount = amount
#     expense.category = category
#     expense.payment_method = payment_method
#     expense.expense_date = expense_date
#     expense.notes = notes

#     db.commit()
#     db.refresh(expense)

#     return expense



# @router.delete("/{expense_id}")
# def delete_expense(expense_id: UUID, db: Session = Depends(get_db)):
#     expense = db.query(Expense).filter(Expense.id == expense_id).first()

#     if not expense:
#         raise HTTPException(status_code=404, detail="Expense not found")

#     db.delete(expense)
#     db.commit()

#     return {"message": "Expense deleted ✅"}
