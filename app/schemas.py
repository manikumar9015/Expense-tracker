from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime
from enum import Enum

# ---------------------- Transaction Enum ----------------------
class TransactionType(str, Enum):
    income = "income"
    expense = "expense"

# ---------------------- User Schemas ----------------------
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str
    is_admin: Optional[bool] = False

class UserRead(UserBase):
    id: int
    is_admin: bool
    created_at: datetime

    class Config:
        orm_mode = True

# ---------------------- Token Schemas ----------------------
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# ---------------------- Transaction Schemas ----------------------
class TransactionBase(BaseModel):
    description: str
    amount: float
    category: str
    type: TransactionType
    transaction_date: date

class TransactionCreate(TransactionBase):
    pass

class TransactionRead(TransactionBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# ---------------------- Report Filtering ----------------------
class ReportFilter(BaseModel):
    start_date: Optional[date]
    end_date: Optional[date]
    category: Optional[str]



class SavingGoalBase(BaseModel):
    goal_name: str
    target_amount: float
    deadline: Optional[date]

class SavingGoalCreate(SavingGoalBase):
    pass

class SavingGoalRead(SavingGoalBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
