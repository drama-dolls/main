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


def settle_daily_meter(user: models.User, tasks: list, db: Session):
    total = len(tasks)
    if total == 0:
        return

    done = len([t for t in tasks if t.is_done])
    incomplete = total - done

    if incomplete == 0:
        user.health_meter += 10
    else:
        user.health_meter -= incomplete * 5

    user.health_meter = max(0.0, user.health_meter)

    if user.health_meter > 100:
        overflow = user.health_meter - 100
        user.allowance_pt += int(overflow)
        user.health_meter = 100.0


@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    today = datetime.date.today()

    # 前日のルーティンがあれば精算してリセット
    yesterday = today - datetime.timedelta(days=1)
    old_routines = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.is_routine == True,
        models.Task.date == yesterday,
        models.Task.is_deleted == False
    ).all()

    if old_routines:
        settle_daily_meter(current_user, old_routines, db)
        for task in old_routines:
            task.is_done = False
            task.date = today

    # 今日のタスク取得
    tasks = db.query(models.Task).filter(
        models.Task.user_id == current_user.id,
        models.Task.is_deleted == False
    ).filter(
        (models.Task.date == today) | (models.Task.is_routine == True)
    ).all()

    db.commit()

    total = len(tasks)
    done = len([t for t in tasks if t.is_done])

    return {
        "tasks": [
            {
                "id": t.id,
                "title": t.title,
                "is_done": t.is_done,
                "is_routine": t.is_routine,
                "date": t.date,
            }
            for t in tasks
        ],
        "progress": {"done": done, "total": total},
        "health_meter": current_user.health_meter,
        "allowance_pt": current_user.allowance_pt,
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
        is_routine=task_data.is_routine,
        date=datetime.date.today()   # ← 追加
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
        models.Task.user_id == current_user.id
    ).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")

    task.is_done = task_data.is_done
    db.commit()
    db.refresh(task)

    return {
        "task": task,
        "health_meter": current_user.health_meter,
        "allowance_pt": current_user.allowance_pt,
    }


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    task = db.query(models.Task).filter(
        models.Task.id == task_id,
        models.Task.user_id == current_user.id
    ).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_deleted = True
    db.commit()
    return {"message": "Task deleted"}
