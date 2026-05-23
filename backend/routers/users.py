import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter()


class UserUpdate(BaseModel):
    remind_time: Optional[str] = None


@router.get("/users/me")
def get_me(
    current_user: models.User = Depends(get_current_user)
):
    return {
        "id":          current_user.id,
        "username":    current_user.username,
        "points":      current_user.points,
        "remind_time": current_user.remind_time,
        "created_at":  current_user.created_at,
    }


@router.patch("/users/me")
def update_me(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if body.remind_time is not None:
        try:
            current_user.remind_time = datetime.time.fromisoformat(body.remind_time)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")

    db.commit()
    db.refresh(current_user)
    return {
        "id":          current_user.id,
        "username":    current_user.username,
        "points":      current_user.points,
        "remind_time": current_user.remind_time,
    }
  
