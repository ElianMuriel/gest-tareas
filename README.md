# Sistema de Gestión de Tareas

Este proyecto es una aplicación web fullstack para gestionar tareas, desarrollada con **FastAPI** en el backend y **React + TypeScript** en el frontend. Permite autenticación con JWT, creación y edición de tareas, asignación de prioridades y filtros avanzados. También cuenta con una vista tipo Kanban (en desarrollo).

---

Documentacion swagger: http://127.0.0.1:8000/docs#/

---

## Tecnologías utilizadas

### Backend – FastAPI
- Python 3.10+
- FastAPI
- SQLAlchemy
- Pydantic v2
- PostgreSQL
- JWT (Authentication)
- Alembic (Migraciones)
- Uvicorn

### Frontend – React
- React 18
- TypeScript
- Vite
- Axios
- CSS plano

---

## Estructura del proyecto
gest_tareas/
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ ├── models/
│ │ ├── schemas/
│ │ ├── routes/
│ │ └── auth/
│ ├── env/
│ └── .env
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ └── components/
│ └── vite.config.ts
└── README.md

---

## ⚙ Instalación

### Requisitos previos
- Python 3.10+
- Node.js y npm
- PostgreSQL instalado y corriendo
- Git

---

###  Backend (FastAPI)

1. Entra al directorio del backend:
   ```bash
   cd backend

Crea un entorno virtual:
python -m venv env
env\Scripts\activate      # En Windows
# source env/bin/activate  # En Linux/Mac

Instala dependencias:
pip install -r requirements.txt

Crear un archivo .env con la siguiente configuración cambiando datos:
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/gest_tareas_db
SECRET_KEY=una_clave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

Ejecuta migraciones con Alembic (si están configuradas):
alembic upgrade head

Ejecuta el servidor:
uvicorn app.main:app --reload

Entra al directorio del frontend:
cd frontend

Instala las dependencias:
npm install

Levanta el frontend:
npm run dev

Accede a la app en:
http://localhost:5173

Funcionalidades principales: 
- Autenticación de usuarios con JWT
- Registro e inicio de sesión
- CRUD completo de tareas
- Asignación de prioridades y responsables
- Filtros por estado, prioridad y usuario asignado
- Estimación de fechas y porcentajes de avance
- Modal reutilizable para crear/editar tareas
- Vista Kanban (en desarrollo)

Rutas útiles
Backend (Swagger): http://localhost:8000/docs

Frontend: http://localhost:5173

---

Autor: 
Elian Muriel
Estudiante de Tecnología en Desarrollo de Software – Universidad UTE
