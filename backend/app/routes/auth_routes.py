from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.auth import create_user, authenticate_user, get_current_user, get_db
from app.schemas import UserCreate, UserResponse
from app.utils.security import create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(user, db)


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
def read_users_me(current_user=Depends(get_current_user)):
    return current_user
