from sqlalchemy import Column, Integer, String, DateTime, Time, Boolean, ForeignKey, Date, Float
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"
    id           = Column(Integer, primary_key=True, index=True)
    username     = Column(String(50), nullable=False, unique=True)
    password     = Column(String(255), nullable=False)
    allowance_pt = Column(Integer, nullable=False, default=30)
    health_meter = Column(Float, nullable=False, default=100.0)
    remind_time  = Column(Time, nullable=True)
    created_at   = Column(DateTime, server_default=func.now())


class Task(Base):
    __tablename__ = "tasks"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    title      = Column(String(100), nullable=False)
    is_done    = Column(Boolean, default=False)
    is_routine = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    date       = Column(Date, server_default=func.current_date())
    created_at = Column(DateTime, server_default=func.now())


class Character(Base):
    __tablename__ = "characters"
    id        = Column(Integer, primary_key=True, index=True)
    name      = Column(String(100), nullable=False)
    image_url = Column(String(255), nullable=True)


class Costume(Base):
    __tablename__ = "costumes"
    id           = Column(Integer, primary_key=True, index=True)
    character_id = Column(Integer, ForeignKey("characters.id"), nullable=False)
    name         = Column(String(100), nullable=False)
    rarity       = Column(String(10), nullable=False)
    image_url    = Column(String(255), nullable=True)
    weight       = Column(Integer, nullable=False, default=100)


class UserCostume(Base):
    __tablename__ = "user_costumes"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    costume_id = Column(Integer, ForeignKey("costumes.id"), nullable=False)
    obtained_at = Column(DateTime, server_default=func.now())


class UserSelection(Base):
    __tablename__ = "user_selections"
    user_id      = Column(Integer, ForeignKey("users.id"), primary_key=True)
    character_id = Column(Integer, ForeignKey("characters.id"), nullable=True)
    costume_id   = Column(Integer, ForeignKey("costumes.id"), nullable=True)

class UserCharacter(Base):
    __tablename__ = "user_characters"
    id           = Column(Integer, primary_key=True, index=True)
    user_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    character_id = Column(Integer, ForeignKey("characters.id"), nullable=False)
    obtained_at  = Column(DateTime, server_default=func.now())