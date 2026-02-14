# Finance Application

## 1. Install Docker

Install Docker from the official website:

https://docs.docker.com/get-docker/

Follow the instructions for your operating system (Windows, macOS, or Linux).

After installation, verify:

```bash
docker --version
docker compose version
```

---

## 2. Clone the Project

```bash
git https://github.com/Prathmesh-Gupta/FinanceTracker.git
cd <PROJECT_FOLDER>
```

---

## 3. After Cloning (IMPORTANT)

Open the file:

```
docker-compose.yml
```

Edit these **2 lines** if needed.

### Backend – CORS_ORIGINS

Find:

```yaml
CORS_ORIGINS: "http://3.106.167.247:3000,http://localhost:3000"
```

If running locally:

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

If needed:

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

## 6. Optional: Insert Dummy Data

Connect to PostgreSQL:

```bash
docker exec -it finance_postgres psql -U finance_user -d finance_db
```

Paste SQL named init.sql script into the console for dummy data.

Skip if not needed.

---

## 7. Stop the Project

```bash
docker compose down
```

Remove database data:

```bash
docker compose down -v
```
