import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter()


def get_video_url(character_name: str, health_meter: float) -> str:
    prefix_map = {
        "デフォルト": "",
        "ギャル": "gal_",
        "シッソ": "sisso_",
        "天使": "tensi_",
    }
    prefix = prefix_map.get(character_name, "")

    if health_meter >= 100:
        state = "cho_kenko"
    elif health_meter >= 60:
        state = "futsu"
    elif health_meter >= 30:
        state = "genki_nai"
    elif health_meter >= 15:
        state = "yatsure"
    elif health_meter >= 1:
        state = "shinikake"
    else:
        state = "ohaka"

    return f"/videos/{prefix}{state}.mp4"


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    today = datetime.date.today()

    tasks = (
        db.query(models.Task)
        .filter(models.Task.user_id == current_user.id, models.Task.is_deleted == False)
        .filter((models.Task.date == today) | (models.Task.is_routine == True))
        .all()
    )

    total = len(tasks)
    done = len([t for t in tasks if t.is_done])

    selection = (
        db.query(models.UserSelection).filter(models.UserSelection.user_id == current_user.id).first()
    )

    video_url = None
    if selection and selection.character_id:
        character = db.query(models.Character).filter(models.Character.id == selection.character_id).first()
        if character:
            video_url = get_video_url(character.name, current_user.health_meter)

    return {
        "user": {
            "username": current_user.username,
            "allowance_pt": current_user.allowance_pt,
            "health_meter": current_user.health_meter,
        },
        "progress": {"done": done, "total": total},
        "selection": {
            "character_id": selection.character_id if selection else None,
            "costume_id": selection.costume_id if selection else None,
            "video_url": video_url,
        },
    }
