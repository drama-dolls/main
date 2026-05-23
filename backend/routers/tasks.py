import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter()


class TaskCreate(BaseModel):
    title: str
    is_routine: bool = False


class TaskUpdate(BaseModel):
    is_done: bool


@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    today = datetime.date.today()

    # 今日作成した通常タスク + ルーティンタスク（日付問わず全件）を返す
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.is_deleted == False
    ).filter(
        (models.Task.date == today) | (models.Task.is_routine == True)
    ).all()

    # ルーティンタスクを日付をまたいでいたらリセット
    for task in tasks:
        if task.is_routine and task.date < today:
            task.is_done = False
            task.date = today
    db.commit()

    total = len(tasks)
    done = len([t for t in tasks if t.is_done])

    return {
        "tasks": tasks,
        "progress": {"done": done, "total": total}
    }


@router.post("/tasks")
def create_task(
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    new_task = models.Task(
        user_id=current_user.id,
        title=task_data.title,
        is_routine=task_data.is_routine
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.patch("/tasks/{task_id}")
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id  # 自分のタスクのみ操作可能
    ).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    # False→True になる時だけポイント付与（二重付与防止）
    if task_data.is_done and not task.is_done:
        current_user.points += 10

    task.is_done = task_data.is_done
    db.commit()
    db.refresh(task)

    return {
        "task": task,
        "points_earned": 10 if task_data.is_done and not task.is_done else 0,
        "total_points": current_user.points
    }


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id  # 自分のタスクのみ削除可能
    ).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
  
