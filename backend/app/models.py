from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import enum

class RoleEnum(str, enum.Enum):
    user = "user"
    admin = "admin"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default="user")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tasks_created = relationship("Task", back_populates="creator", foreign_keys="Task.created_by")
    tasks_assigned = relationship("Task", back_populates="assignee", foreign_keys="Task.assigned_to")

class Priority(Base):
    __tablename__ = "priorities"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    level = Column(Integer, nullable=False)  # 1-5
    color = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    tasks = relationship("Task", back_populates="priority")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    assigned_to = Column(Integer, ForeignKey("users.id"))
    created_by = Column(Integer, ForeignKey("users.id"))
    priority_id = Column(Integer, ForeignKey("priorities.id"))
    status = Column(String, default="Pendiente")
    due_date = Column(DateTime)
    estimated_hours = Column(Integer)
    completion_percentage = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    assignee = relationship("User", foreign_keys=[assigned_to], back_populates="tasks_assigned")
    creator = relationship("User", foreign_keys=[created_by], back_populates="tasks_created")
    priority = relationship("Priority", back_populates="tasks")
