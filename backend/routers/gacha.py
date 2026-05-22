from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random

import models
from database import get_db

router = APIRouter()

RARITY_TABLE = [
    {"rarity": "SR", "weight": 5},
    {"rarity": "R", "weight": 30},
    {"rarity": "N", "weight": 65},
]

@router.post("/users/{user_id}/gacha")
def gacha(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.points < 30:
        raise HTTPException(status_code=400, detail="Not enough points")

    rarities = [r["rarity"] for r in RARITY_TABLE]
    weights = [r["weight"] for r in RARITY_TABLE]
    chosen_rarity = random.choices(rarities, weights=weights, k=1)[0]

    items = db.query(models.Item).filter(models.Item.rarity == chosen_rarity).all()
    if not items:
        raise HTTPException(status_code=404, detail="No items available")
    chosen_item = random.choice(items)

    user.points -= 30

    user_item = models.UserItem(user_id=user_id, item_id=chosen_item.id)
    db.add(user_item)
    db.commit()

    return {
        "item_id": chosen_item.id,
        "item_name": chosen_item.name,
        "rarity": chosen_item.rarity,
        "remaining_points": user.points
    }
