from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import datetime

import models
from database import get_db

router = APIRouter()

@router.get("/users/{user_id}/summary")
def get_user_summary(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    today = datetime.date.today()
    tasks = db.query(models.Task).filter(
        models.Task.user_id == user_id,
        models.Task.date == today
    ).all()

    total = len(tasks)
    done = len([t for t in tasks if t.is_done])
    achievement = (done / total * 100) if total > 0 else 0

    return {
        "user_id": user.id,
        "username": user.username,
        "points": user.points,
        "today_tasks_total": total,
        "today_tasks_done": done,
        "achievement_rate": achievement
    }
