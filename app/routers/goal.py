from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db
from app.auth import get_current_user  # Assumes you have this for auth

router = APIRouter()

@router.post("/", response_model=schemas.SavingGoalRead)
def create_goal(goal: schemas.SavingGoalCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_goal = models.SavingGoal(**goal.dict(), user_id=user.id)
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.get("/", response_model=list[schemas.SavingGoalRead])
def get_goals(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(models.SavingGoal).filter(models.SavingGoal.user_id == user.id).all()

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    goal = db.query(models.SavingGoal).filter(models.SavingGoal.id == goal_id, models.SavingGoal.user_id == user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted"}
