from .database import SessionLocal
from fastapi import Depends
from sqlalchemy.orm import Session
from .auth import get_current_active_user, get_current_admin_user

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user_dep(current_user=Depends(get_current_active_user)):
    return current_user

def get_current_admin_dep(current_admin=Depends(get_current_admin_user)):
    return current_admin
