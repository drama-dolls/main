import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
SYNC_DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://")

# TCP keepalivesの複雑な設定は、OS環境によっては逆に不安定になることがあるため外します
# 代わりに SQLAlchemy の pool_pre_ping と pool_recycle に管理を任せます
engine = create_engine(
    SYNC_DATABASE_URL,
    connect_args={
        "sslmode": "disable",
        "connect_timeout": 15,
    },
    pool_pre_ping=True,      # 接続前に死んでいないかチェック（必須）
    pool_size=5,             # 並行処理用
    max_overflow=10,         # 溢れた場合のバッファ
    pool_recycle=300,        # 5分(300秒)でコネクションを自主的に作り直す
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