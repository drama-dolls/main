import datetime
from fastapi import APIRouter, Depends, HTTPException
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

    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.is_deleted == False
    ).filter(
        (models.Task.date == today) | (models.Task.is_routine == True)
    ).all()

    total = len(tasks)
    done = len([t for t in tasks if t.is_done])

    selection = db.query(models.UserSelection).filter(
        models.UserSelection.user_id == current_user.id
    ).first()

    return {
        "user": {
            "username": current_user.username,
            "allowance_pt": current_user.allowance_pt,
            "health_meter": current_user.health_meter,
        },
        "progress": {
            "done": done,
            "total": total,
        },
        "selection": {
            "character_id": selection.character_id if selection else None,
            "costume_id": selection.costume_id if selection else None,
        }
    }
