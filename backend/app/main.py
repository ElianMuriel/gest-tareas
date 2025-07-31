# app/main.py
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal, Base, engine
from app import models  # 👈 Necesario para registrar las tablas
from app.routes import auth_routes, priority_routes, task_routes

app = FastAPI()

# Dependencia para obtener la DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root(db: Session = Depends(get_db)):
    return {"message": "Conexión con Neon exitosa"}

# Crear las tablas en la base de datos si no existen
Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(priority_routes.router, prefix="/priorities", tags=["Priorities"])
app.include_router(task_routes.router, prefix="/tasks", tags=["Tasks"])