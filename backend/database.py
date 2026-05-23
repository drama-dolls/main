import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# SQLite / PostgreSQL の両方に対応
if DATABASE_URL.startswith("sqlite"):
    # SQLite の場合
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    # PostgreSQL の場合
    SYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://")
    engine = create_engine(
        SYNC_DATABASE_URL,
        connect_args={
            "sslmode": "disable",
            "connect_timeout": 15,
        },
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        pool_recycle=300,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI推奨の最もシンプルなセッション管理に戻します
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()