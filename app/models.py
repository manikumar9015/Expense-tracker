from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Numeric, Enum, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
import enum

# Enum for transaction type
class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"

# User model
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=True)  # ✅ Added to match schema
    hashed_password = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="owner")
    saving_goals = relationship("SavingGoal", back_populates="user", cascade="all, delete")


# Transaction model
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    description = Column(String(255), index=True)
    amount = Column(Numeric(10, 2))
    category = Column(String(100), index=True)
    type = Column(Enum(TransactionType))
    transaction_date = Column(Date)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="transactions")

class SavingGoal(Base):
    __tablename__ = "saving_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))  # FK to users table
    goal_name = Column(String(100), nullable=False)
    target_amount = Column(Numeric(10, 2), nullable=False)
    deadline = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="saving_goals")
