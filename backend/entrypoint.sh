#!/bin/bash

echo "⏳ Waiting for PostgreSQL..."

until pg_isready -h postgres -p 5432 -U finance_user
do
  sleep 2
done

echo "✅ PostgreSQL is ready"

echo "🚀 Starting backend in background..."
uvicorn main:app --host 0.0.0.0 --port 8000 &

BACKEND_PID=$!

echo "⏳ Waiting for tables to be created..."

until psql $DATABASE_URL -c "\dt users" | grep -q users
do
  sleep 2
done

echo "✅ Tables detected"

echo "🌱 Running init.sql..."
psql $DATABASE_URL -f /app/init.sql

echo "✅ Seeding done"

wait $BACKEND_PID
