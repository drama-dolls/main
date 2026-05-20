from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

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

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI"}



# ユーザーを1人登録する (POST)
@app.post("/users/")
def create_user(username: str, db: Session = Depends(get_db)):
    # 新しいユーザーオブジェクトを作る
    new_user = models.User(username=username, points=0)
    # DBに追加してコミット（保存）
    db.add(new_user)
    db.commit()
    db.refresh(new_user) # IDなどが確定した最新状態を反映
    return new_user


# ユーザー情報をIDで取得する (GET)
@app.get("/users/{user_id}")
def read_user(user_id: int, db: Session = Depends(get_db)):
    # DBから指定されたIDのユーザーを検索
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
