from sqlalchemy import Column, Integer, String, DateTime, Time, Boolean, ForeignKey, Date

from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    points = Column(Integer, nullable=False, default=0)
    remind_time = Column(Time, nullable=True) 
    created_at = Column(DateTime, server_default=func.now())

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(100), nullable=False)
    is_done = Column(Boolean, default=False)
    is_routine = Column(Boolean, default=False)
    date = Column(Date, server_default=func.current_date())
    created_at = Column(DateTime, server_default=func.now())