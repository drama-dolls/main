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


# --- Task API ---

class TaskCreate(BaseModel):
    title: str
    is_routine: bool = False

class TaskUpdate(BaseModel):
    is_done: bool

# タスク一覧取得
@app.get("/users/{user_id}/tasks")
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.user_id == user_id).all()
    return tasks

# タスク追加
@app.post("/users/{user_id}/tasks")
def create_task(user_id: int, task_data: TaskCreate, db: Session = Depends(get_db)):
    new_task = models.Task(
        user_id=user_id,
        title=task_data.title,
        is_routine=task_data.is_routine
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# タスク完了・未完了の切り替え（ポイント加算あり）
@app.patch("/tasks/{task_id}")
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_done = task_data.is_done
    # 完了にしたときだけポイント加算
    if task_data.is_done:
        user = db.query(models.User).filter(models.User.id == task.user_id).first()
        user.points += 10
    db.commit()
    db.refresh(task)
    return task

# タスク削除
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}

# --- Gacha API ---

import random

RARITY_TABLE = [
    {"rarity": "SR", "weight": 5},
    {"rarity": "R", "weight": 30},
    {"rarity": "N", "weight": 65},
]

@app.post("/users/{user_id}/gacha")
def gacha(user_id: int, db: Session = Depends(get_db)):
    # ユーザー確認
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # ポイントチェック（ガチャ1回30ポイント）
    if user.points < 30:
        raise HTTPException(status_code=400, detail="Not enough points")

    # レアリティ抽選
    rarities = [r["rarity"] for r in RARITY_TABLE]
    weights = [r["weight"] for r in RARITY_TABLE]
    chosen_rarity = random.choices(rarities, weights=weights, k=1)[0]

    # 該当レアリティのアイテムをランダムに取得
    items = db.query(models.Item).filter(models.Item.rarity == chosen_rarity).all()
    if not items:
        raise HTTPException(status_code=404, detail="No items available")
    chosen_item = random.choice(items)

    # ポイント消費
    user.points -= 30

    # アイテムをユーザーに付与
    user_item = models.UserItem(user_id=user_id, item_id=chosen_item.id)
    db.add(user_item)
    db.commit()

    return {
        "item_id": chosen_item.id,
        "item_name": chosen_item.name,
        "rarity": chosen_item.rarity,
        "remaining_points": user.points
    }
