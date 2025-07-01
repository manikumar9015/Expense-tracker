from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import schemas, crud
from app.deps import get_db, get_current_user_dep

router = APIRouter()

@router.post("/", response_model=schemas.TransactionRead)
def add_transaction(
    transaction: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_dep),
):
    return crud.create_transaction(db, transaction, user.id)

@router.get("/", response_model=List[schemas.TransactionRead])
def get_user_transactions(
    db: Session = Depends(get_db),
    user=Depends(get_current_user_dep),
    start_date: str = None,
    end_date: str = None,
    category: str = None
):
    return crud.get_transactions(db, user.id, start_date, end_date, category)

@router.get("/summary")
def user_summary(
    db: Session = Depends(get_db),
    user=Depends(get_current_user_dep),
):
    return crud.get_user_totals(db, user.id)

@router.put("/{transaction_id}", response_model=schemas.TransactionRead)
def update_transaction(
    transaction_id: int,
    updated: schemas.TransactionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_dep),
):
    updated_tx = crud.update_transaction(db, transaction_id, updated, user.id)
    if not updated_tx:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return updated_tx

@router.delete("/{transaction_id}", status_code=204)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user_dep),
):
    success = crud.delete_transaction(db, transaction_id, user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Transaction not found")
