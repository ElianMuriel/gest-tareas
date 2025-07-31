# app/routes/priority_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import PriorityCreate, PriorityResponse
from app.models import Priority, User
from app.auth import get_db, get_current_user
from typing import List

router = APIRouter()


def is_admin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Solo administradores pueden realizar esta acción")


@router.get("/", response_model=List[PriorityResponse])
def get_priorities(db: Session = Depends(get_db)):
    return db.query(Priority).all()


@router.post("/", response_model=PriorityResponse)
def create_priority(priority: PriorityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    new_priority = Priority(**priority.dict())
    db.add(new_priority)
    db.commit()
    db.refresh(new_priority)
    return new_priority


@router.put("/{priority_id}", response_model=PriorityResponse)
def update_priority(priority_id: int, priority: PriorityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    existing = db.query(Priority).filter(Priority.id == priority_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Prioridad no encontrada")
    for key, value in priority.dict().items():
        setattr(existing, key, value)
    db.commit()
    db.refresh(existing)
    return existing


@router.delete("/{priority_id}")
def delete_priority(priority_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    is_admin(current_user)
    existing = db.query(Priority).filter(Priority.id == priority_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Prioridad no encontrada")
    db.delete(existing)
    db.commit()
    return {"detail": "Prioridad eliminada"}
