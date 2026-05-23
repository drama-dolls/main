import random
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter()

GACHA_COST = 30
DUPLICATE_REFUND = 10

@router.post("/gacha/pull")
def pull_gacha(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.allowance_pt < GACHA_COST:
        raise HTTPException(status_code=400, detail="Not enough points")

    costumes = db.query(models.Costume).all()
    if not costumes:
        raise HTTPException(status_code=404, detail="No costumes available")

    chosen = random.choices(costumes, weights=[c.weight for c in costumes], k=1)[0]

    already_owned = db.query(models.UserCostume).filter(
        models.UserCostume.user_id == current_user.id,
        models.UserCostume.costume_id == chosen.id
    ).first()

    is_duplicate = already_owned is not None
    current_user.allowance_pt -= GACHA_COST

    if is_duplicate:
        current_user.allowance_pt += DUPLICATE_REFUND
    else:
        db.add(models.UserCostume(user_id=current_user.id, costume_id=chosen.id))

    db.commit()

    character = db.query(models.Character).filter(
        models.Character.id == chosen.character_id
    ).first()

    return {
        "costume_id": chosen.id,
        "costume_name": chosen.name,
        "character_name": character.name if character else None,
        "rarity": chosen.rarity,
        "image_url": chosen.image_url,
        "is_duplicate": is_duplicate,
        "allowance_pt": current_user.allowance_pt,
    }

@router.get("/gacha/costumes")
def get_my_costumes(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    user_costumes = db.query(models.UserCostume).filter(
        models.UserCostume.user_id == current_user.id
    ).all()

    result = []
    for uc in user_costumes:
        costume = db.query(models.Costume).filter(models.Costume.id == uc.costume_id).first()
        character = db.query(models.Character).filter(models.Character.id == costume.character_id).first()
        result.append({
            "user_costume_id": uc.id,
            "costume_id": costume.id,
            "costume_name": costume.name,
            "character_id": character.id,
            "character_name": character.name,
            "rarity": costume.rarity,
            "image_url": costume.image_url,
            "obtained_at": uc.obtained_at,
        })

    return result

