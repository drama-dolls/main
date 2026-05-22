from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

import models
from database import get_db

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    is_routine: bool = False

class TaskUpdate(BaseModel):
    is_done: bool

@router.get("/users/{user_id}/tasks")
def get_tasks(user_id: int, db: Session = Depends(get_db)):
    tasks = db.query(models.Task).filter(models.Task.user_id == user_id).all()
    return tasks

@router.post("/users/{user_id}/tasks")
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

@router.patch("/tasks/{task_id}")
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    task.is_done = task_data.is_done
    if task_data.is_done:
        user = db.query(models.User).filter(models.User.id == task.user_id).first()
        user.points += 10
    db.commit()
    db.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
