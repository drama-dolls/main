from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import datetime

import models
from database import get_db

router = APIRouter()

class UserCreate(BaseModel):
    username: str
    remind_time: Optional[str] = None

@router.post("/users/")
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    parsed_time = None
    if user_data.remind_time:
        try:
            parsed_time = datetime.time.fromisoformat(user_data.remind_time)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")

    new_user = models.User(
        username=user_data.username,
        points=0,
        remind_time=parsed_time
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user