# Finance Application

Live Project Frontend link : http://3.26.192.211:3000/dashboard Live Project swagger Doc : http://3.26.192.211:8000/docs



## 1. Install Docker

Install Docker from the official website:

https://docs.docker.com/get-docker/

Follow the instructions for your operating system (Windows, macOS, or Linux).

Verify installation:

```bash
docker --version
docker compose version
```

---

## 2. Clone the Project

```bash
git clone https://github.com/Prathmesh-Gupta/FinanceTracker.git
cd <PROJECT_FOLDER>
```

---

## 3. After Cloning (IMPORTANT)

Open:

```
docker-compose.yml
```

Edit these 2 lines if needed.

### Backend – CORS_ORIGINS

Find:

```yaml
CORS_ORIGINS: "http://3.106.167.247:3000,http://localhost:3000"
```

For local use:

```yaml
CORS_ORIGINS: "http://localhost:3000"
```

Or replace with your local IP:

```yaml
CORS_ORIGINS: "http://YOUR_LOCAL_IP:3000"
```

---

### Frontend – NEXT_PUBLIC_API_URL

Find:

```yaml
NEXT_PUBLIC_API_URL: http://localhost:8000
```

Update if needed:

```yaml
NEXT_PUBLIC_API_URL: http://YOUR_LOCAL_IP:8000
```

Or keep:

```yaml
NEXT_PUBLIC_API_URL: http://localhost:8000
```

---

## 4. Run the Project

```bash
docker compose up -d --build
```

---

## 5. Access the Application

Frontend:
```
http://localhost:3000
```

Backend:
```
http://localhost:8000
```

Database:
```
Host: localhost
Port: 5432
User: finance_user
Password: finance_pass
Database: finance_db
```

---

## 6. Important Test Case – Recurring Engine (Salary / SIP / Savings)

### Feature Covered
- Salary auto credit
- SIP auto debit
- Savings auto debit

### Original Design
The original plan was to:
- Use a cron job or Python scheduler
- Automatically call an API based on due date
- Credit salary
- Debit SIP and savings
- Update next due date

Due to time constraints, automatic scheduling was not implemented.

### Current Implementation

A manual API endpoint is provided to trigger the recurring engine.

Swagger Docs:
```
http://3.26.192.211:8000/docs
```

Endpoint:
```
POST /recurring/execute
```

Full URL:
```
http://3.26.192.211:8000/docs#/Recurring/run_recurring_engine_recurring_execute_post
```

### How It Works (For Demo)

- On hitting this API:
  - All Salary entries are credited
  - All SIP entries are debited
  - All Savings entries are debited
- Date filtering is currently ignored for demonstration purposes.
- This allows salary reflection and auto-debit functionality to be demonstrated.

Later, proper date validation can be added to:
- Run only on due date
- Update next due date correctly
- Integrate with a scheduler (cron job)

---

## 7. Optional: Insert Dummy Data

Connect to PostgreSQL:

```bash
docker exec -it finance_postgres psql -U finance_user -d finance_db
```

Paste SQL script at base location with name init into the console.

Skip if not needed.

---

## 8. Stop the Project

```bash
docker compose down
```

Remove database data:

```bash
docker compose down -v
```
