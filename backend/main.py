from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import datetime

import models
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Reactからのアクセスを許可（CORS設定）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
    "http://localhost:5174",], # Viteのデフォルトポート
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    username: str
    remind_time: Optional[str] = None 


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}


@app.post("/users/")
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    # 時間の文字列をPythonのtimeオブジェクトに変換
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

@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
