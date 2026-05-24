import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

import models
from database import get_db
from routers.auth import get_current_user

router = APIRouter()


class UserUpdate(BaseModel):
    remind_time: Optional[str] = None


class SelectionUpdate(BaseModel):
    character_id: Optional[int] = None
    costume_id: Optional[int] = None


@router.get("/users/me")
def get_me(
    current_user: models.User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "allowance_pt": current_user.allowance_pt,
        "health_meter": current_user.health_meter,
        "remind_time": current_user.remind_time,
        "created_at": current_user.created_at,
    }


@router.patch("/users/me")
def update_me(
    body: UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if body.remind_time is not None:
        try:
            current_user.remind_time = datetime.time.fromisoformat(body.remind_time)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid time format. Use HH:MM")
    db.commit()
    db.refresh(current_user)
    return {
        "username": current_user.username,
        "allowance_pt": current_user.allowance_pt,
        "health_meter": current_user.health_meter,
        "remind_time": current_user.remind_time,
    }


@router.patch("/users/me/selection")
def update_selection(
    body: SelectionUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 衣装を持っているか確認
    if body.costume_id:
        owned = db.query(models.UserCostume).filter(
            models.UserCostume.user_id == current_user.id,
            models.UserCostume.costume_id == body.costume_id,
        ).first()
        if not owned:
            raise HTTPException(status_code=403, detail="Costume not owned")
    
    if body.character_id:
      owned = db.query(models.UserCharacter).filter(
          models.UserCharacter.user_id       == current_user.id,
          models.UserCharacter.character_id  == body.character_id
      ).first()
      if not owned:
          raise HTTPException(status_code=403, detail="Character not owned")

    selection = db.query(models.UserSelection).filter(
        models.UserSelection.user_id == current_user.id
    ).first()

    if selection:
        if body.character_id is not None:
            selection.character_id = body.character_id
        if body.costume_id is not None:
            selection.costume_id = body.costume_id
    else:
        selection = models.UserSelection(
            user_id=current_user.id,
            character_id=body.character_id,
            costume_id=body.costume_id,
        )
        db.add(selection)

    db.commit()
    return {
        "character_id": selection.character_id,
        "costume_id": selection.costume_id,
    }
  
@router.get("/users/me/characters")
def get_my_characters(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
      user_characters = db.query(models.UserCharacter).filter(
          models.UserCharacter.user_id == current_user.id
      ).all()

      result = []
      for uc in user_characters:
          character = db.query(models.Character).filter(
              models.Character.id == uc.character_id
          ).first()
          result.append({
              "character_id": character.id,
              "name":         character.name,
              "image_url":    character.image_url,
          })
      return result