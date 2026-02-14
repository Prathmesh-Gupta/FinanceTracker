from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from dependencies.database import SessionLocal,get_db
from models.AccountModel import Account

router = APIRouter(prefix="/accounts", tags=["Accounts"])



@router.post("/")
def create_account(name: str, type: str, balance: float = 0, db: Session = Depends(get_db)):
    account = Account(
        name=name,
        type=type,
        balance=balance,
        user_id="00000000-0000-0000-0000-000000000001"  # demo user
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return account



@router.get("/")
def get_accounts(db: Session = Depends(get_db)):
    return db.query(Account).all()



@router.get("/{account_id}")
def get_account(account_id: UUID, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    return account



@router.put("/{account_id}")
def update_account(account_id: UUID, name: str, type: str, balance: float, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    account.name = name
    account.type = type
    account.balance = balance

    db.commit()
    db.refresh(account)

    return account



@router.delete("/{account_id}")
def delete_account(account_id: UUID, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    db.delete(account)
    db.commit()

    return {"message": "Account deleted ✅"}
