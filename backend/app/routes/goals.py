from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import date

from dependencies.database import get_db
from models.GoalModel import Goal

router = APIRouter(prefix="/goals", tags=["Goals"])

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"


@router.post("/")
def create_goal(
    title: str,
    target_amount: float,
    target_date: date,
    db: Session = Depends(get_db)
):
    goal = Goal(
        title=title,
        target_amount=target_amount,
        target_date=target_date,
        user_id=DEMO_USER_ID
    )

    db.add(goal)
    db.commit()
    db.refresh(goal)

    return goal



@router.get("/")
def get_goals(db: Session = Depends(get_db)):
    return db.query(Goal).all()




@router.get("/{goal_id}")
def get_goal(goal_id: UUID, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    return goal



@router.put("/{goal_id}")
def update_goal(
    goal_id: UUID,
    title: str,
    target_amount: float,
    target_date: date,
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.title = title
    goal.target_amount = target_amount
    goal.target_date = target_date

    db.commit()
    db.refresh(goal)

    return goal




@router.delete("/{goal_id}")
def delete_goal(goal_id: UUID, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()

    return {"message": "Goal deleted ✅"}
