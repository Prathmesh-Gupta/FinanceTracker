Personal Expense Tracker – Full Stack Demo

Live Deployment Frontend: http://3.26.192.211:3000/dashboard API Docs
(Swagger): http://3.26.192.211:8000/docs

Tech Stack Frontend: Next.js Backend: FastAPI Database: PostgreSQL
Deployment: Docker / AWS EC2

Features - Full CRUD Operations (Create, Read, Update, Delete) - RESTful
APIs with FastAPI - PostgreSQL Database Integration - Interactive
Dashboard / Data Visualization - Third-Party API Integration -
Dockerized Setup - Live Cloud Deployment

Setup Instructions

1.  Install Docker Install Docker from:
    https://docs.docker.com/get-docker/

Verify installation: docker –version docker compose version

2.  Clone the Project git clone
    https://github.com/Prathmesh-Gupta/FinanceTracker.git cd
    FinanceTracker

3.  Configure Environment Variables (IMPORTANT) Open docker-compose.yml

Backend – CORS_ORIGINS CORS_ORIGINS: “http://localhost:3000”

Frontend – NEXT_PUBLIC_API_URL NEXT_PUBLIC_API_URL:
http://localhost:8000

4.  Run the Project docker compose up -d –build

5.  Access the Application Frontend: http://localhost:3000 Backend:
    http://localhost:8000

Database Host: localhost Port: 5432 User: finance_user Password:
finance_pass Database: finance_db

6.  Optional – Insert Dummy Data docker exec -it finance_postgres psql
    -U finance_user -d finance_db

Run init.sql if required.

How to Test

CRUD Flow 1. Open http://localhost:3000 2. Navigate to Expenses 3.
Create → Update → Delete expense

Dashboard Navigate to /dashboard Charts update dynamically

API Testing Open http://localhost:8000/docs

7.  Stop the Project docker compose down docker compose down -v

Author Prathmesh Gupta
