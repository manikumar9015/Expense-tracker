from sqlalchemy.orm import Session
from sqlalchemy import func
from app import models, schemas
from app.utils import get_password_hash

# ---------- User CRUD ----------

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        username=user.username.lower(),
        email=user.email,
        full_name=user.full_name.title(),
        hashed_password=hashed_password,
        is_admin=user.is_admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_all_users(db: Session):
    return db.query(models.User).all()

def delete_user(db: Session, user_id: int):
    user = get_user_by_id(db, user_id)
    if user:
        db.delete(user)
        db.commit()
        return True
    return False

def logout_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        user.is_active = False
        db.commit()
        db.refresh(user)
        print("logged out")
        return True
    return False

# ---------- Transaction CRUD ----------

def create_transaction(db: Session, data: schemas.TransactionCreate, user_id: int):
    transaction_data = data.dict()
    transaction_data["description"] = transaction_data["description"].capitalize()
    transaction_data["category"] = transaction_data["category"].title()
    transaction_data["type"] = transaction_data["type"].lower()

    transaction = models.Transaction(**transaction_data, user_id=user_id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

def get_transactions(db: Session, user_id: int, start_date: str = None, end_date: str = None, category: str = None):
    query = db.query(models.Transaction).filter(models.Transaction.user_id == user_id)

    if start_date:
        query = query.filter(models.Transaction.transaction_date >= start_date)
    if end_date:
        query = query.filter(models.Transaction.transaction_date <= end_date)
    if category:
        query = query.filter(models.Transaction.category == category)

    return query.order_by(models.Transaction.transaction_date.desc()).all()

def get_user_totals(db: Session, user_id: int):
    income = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.type == "income"
    ).scalar() or 0

    expense = db.query(func.sum(models.Transaction.amount)).filter(
        models.Transaction.user_id == user_id,
        models.Transaction.type == "expense"
    ).scalar() or 0

    return {
        "total_income": float(income),
        "total_expense": float(expense),
        "balance": float(income - expense)
    }

def update_transaction(db: Session, transaction_id: int, data: schemas.TransactionCreate, user_id: int):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == user_id
    ).first()

    if not transaction:
        return None

    for key, value in data.dict().items():
        setattr(transaction, key, value)

    db.commit()
    db.refresh(transaction)
    return transaction

def delete_transaction(db: Session, transaction_id: int, user_id: int):
    transaction = db.query(models.Transaction).filter(
        models.Transaction.id == transaction_id,
        models.Transaction.user_id == user_id
    ).first()

    if not transaction:
        return False

    db.delete(transaction)
    db.commit()
    return True
