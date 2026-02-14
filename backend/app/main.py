from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dependencies.database import engine, Base

# IMPORTANT: import models so tables are registered
from models import UserModel, AccountModel, ExpenseModel, GoalModel, RecurringTransModel
from routes import accounts, expenses, recurring, goals, dashboard, insights, Investments

app = FastAPI(title="Finance API")

# # ✅ CORS MUST COME BEFORE ROUTERS
# origins = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
#     "http://3.106.167.247:3000",  # your frontend
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

import os
from fastapi.middleware.cors import CORSMiddleware

# Read CORS origins from environment
origins_env = os.getenv("CORS_ORIGINS", "*")

# Convert comma-separated string to list
if origins_env == "*":
    origins = ["*"]
else:
    origins = [origin.strip() for origin in origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def health():
    return {"status": "ok"}

# ✅ Routers AFTER middleware
app.include_router(accounts.router)
app.include_router(expenses.router)
app.include_router(recurring.router)
app.include_router(goals.router)
app.include_router(insights.router)
app.include_router(dashboard.router)
app.include_router(Investments.router)



