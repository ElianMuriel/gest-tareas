from dataclasses import field
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from app.auth import get_db, get_current_user
from app.models import Task, User
from app.schemas import TaskCreate, TaskUpdate, TaskResponse, TaskOut
from typing import List, Optional

router = APIRouter()


@router.get("/", response_model=List[TaskOut])
def get_tasks(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
    title: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    priority_id: Optional[int] = Query(None),
    assigned_to: Optional[int] = Query(None),
):
    query = db.query(Task).options(
        joinedload(Task.assignee), 
        joinedload(Task.priority)
    )

    if title:
        query = query.filter(Task.title.ilike(f"%{title}%"))
    if status:
        query = query.filter(Task.status == status)
    if priority_id:
        query = query.filter(Task.priority_id == priority_id)
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)

    return query.all()


@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_task = Task(
        title=task.title,
        description=task.description,
        assigned_to=task.assigned_to,
        created_by=current_user.id,
        priority_id=task.priority_id,
        status=task.status,
        due_date=task.due_date,
        estimated_hours=task.estimated_hours,
        completion_percentage=task.completion_percentage
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    return task


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    for key, value in task_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no encontrada")
    db.delete(task)
    db.commit()
    return {"detail": "Tarea eliminada"}
