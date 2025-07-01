from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm

from app import schemas, crud
from app.deps import get_db, get_current_admin_dep
from app.auth import create_access_token, authenticate_user, get_current_user

router = APIRouter()

@router.post("/register", status_code=201, response_model=schemas.UserRead)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = crud.get_user_by_username(db, user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db, user)

@router.post("/token", response_model=schemas.Token)
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)  # ✅ No await
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.username}, timedelta(minutes=30))
    return {"access_token": token, "token_type": "bearer"}

@router.post("/logout", status_code=200)
def logout_user(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    success = crud.logout_user(db, current_user.id)
    if not success:
        raise HTTPException(status_code=400, detail="Logout failed")
    return {"detail": "Logged out successfully"}

@router.get("/users", response_model=list[schemas.UserRead])
def list_users(db: Session = Depends(get_db), admin=Depends(get_current_admin_dep)):
    return crud.get_all_users(db)

@router.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin_dep)):
    success = crud.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
