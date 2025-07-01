from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app import models
from app.database import engine
from app.routers import users, transactions, reports
from app.routers import goal



# Create the FastAPI app
app = FastAPI(title="Expense Tracker API")

# Create all database tables
models.Base.metadata.create_all(bind=engine)

# Allow CORS for frontend apps like React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # In production, replace * with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/auth", tags=["Authentication"])
app.include_router(transactions.router, prefix="/transactions", tags=["Transactions"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])
app.include_router(goal.router, prefix="/goals", tags=["Saving Goals"])


# Optional root route
@app.get("/")
def read_root():
    return {"message": "Welcome to the Expense Tracker API"}
