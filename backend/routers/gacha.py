import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

GACHA_COST = 30

RARITY_TABLE = [
    {"rarity": "SR", "weight": 5},
    {"rarity": "R",  "weight": 30},
    {"rarity": "N",  "weight": 65},
]


@router.post("/gacha/pull")
def pull_gacha(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.points < GACHA_COST:
        raise HTTPException(status_code=400, detail="Not enough points")

    rarities = [r["rarity"] for r in RARITY_TABLE]
    weights = [r["weight"] for r in RARITY_TABLE]
    chosen_rarity = random.choices(rarities, weights=weights, k=1)[0]

    items = db.query(models.Item).filter(models.Item.rarity == chosen_rarity).all()
    if not items:
        raise HTTPException(status_code=404, detail="No items available for this rarity")

    chosen_item = random.choice(items)

    already_owned = db.query(models.UserItem).filter(
        models.UserItem.user_id == current_user.id,
        models.UserItem.item_id == chosen_item.id
    ).first()

    is_duplicate = already_owned is not None

    current_user.points -= GACHA_COST
    if is_duplicate:
        current_user.points += 10
    else:
        db.add(models.UserItem(user_id=current_user.id, item_id=chosen_item.id))

    db.commit()

    return {
        "item_id": chosen_item.id,
        "item_name": chosen_item.name,
        "rarity": chosen_item.rarity,
        "is_duplicate": is_duplicate,
        "points_remaining": current_user.points,
    }


@router.get("/gacha/items")
def get_my_items(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user_items = db.query(models.UserItem).filter(
        models.UserItem.user_id == current_user.id
    ).all()

    result = []
    for ui in user_items:
        item = db.query(models.Item).filter(models.Item.id == ui.item_id).first()
        result.append({
            "user_item_id": ui.id,
            "item_id": item.id,
            "item_name": item.name,
            "rarity": item.rarity,
            "image_url": item.image_url,
            "is_equipped": ui.is_equipped,
            "obtained_at": ui.obtained_at,
        })

    return result

