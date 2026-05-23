import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter()


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    today = datetime.date.today()

    # 今日のタスク＋ルーティン全件取得
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.is_deleted == False
    ).filter(
        (models.Task.date == today) | (models.Task.is_routine == True)
    ).all()

    total = len(tasks)
    done = len([t for t in tasks if t.is_done])
    rate = (done / total * 100) if total > 0 else 0

    return {
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "points": current_user.points,
        },
        "progress": {
            "done": done,
            "total": total,
            "achievement_rate": round(rate, 1),
        }
    }
