from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ========== User Schemas ==========
class UserBase(BaseModel):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        orm_mode = True


# ========== Priority Schemas ==========
class PriorityBase(BaseModel):
    name: str
    level: int
    color: Optional[str] = None
    description: Optional[str] = None


class PriorityCreate(PriorityBase):
    pass


class PriorityResponse(PriorityBase):
    id: int

    class Config:
        orm_mode = True


# ========== Task Schemas ==========
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    priority_id: Optional[int] = None
    status: Optional[str] = "Pendiente"
    due_date: Optional[datetime] = None
    estimated_hours: Optional[int] = None
    completion_percentage: Optional[int] = 0


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int
    created_by: int
    created_at: datetime

    class Config:
        orm_mode = True
