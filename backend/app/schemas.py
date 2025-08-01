from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime
from enum import Enum


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
        from_attributes = True


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
        from_attributes = True


# ========== Task Schemas ==========
class StatusEnum(str, Enum):
    pendiente = "pendiente"
    progreso = "progreso"
    completado = "completado"

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[int] = None
    priority_id: Optional[int] = None
    status: StatusEnum = StatusEnum.pendiente
    due_date: Optional[datetime] = None
    estimated_hours: Optional[int] = None
    completion_percentage: Optional[int] = 0


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    model_config = ConfigDict(extra='forbid', arbitrary_types_allowed=True)

    title: str | None = None
    description: str | None = None
    assigned_to: int | None = None
    priority_id: int | None = None
    status: StatusEnum | None = None
    due_date: datetime | None = None
    estimated_hours: int | None = None
    completion_percentage: int | None = None


class TaskResponse(TaskBase):
    id: int
    created_by: int
    created_at: datetime
    priority: Optional[PriorityResponse]
    assignee: Optional[UserResponse]

    class Config:
        from_attributes = True

class TaskOut(TaskBase):
    id: int
    created_by: int
    created_at: datetime
    assignee: Optional[UserResponse] = None
    priority: Optional[PriorityResponse] = None

    class Config:
        from_attributes = True
