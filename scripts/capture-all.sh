#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

echo "🐳 Starting PostgreSQL..."
docker compose -f "$BACKEND_DIR/docker-compose.yml" up -d postgres
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker exec taskmanager-db pg_isready -U postgres &>/dev/null; do sleep 1; done
echo "✅ PostgreSQL ready"

echo "🚀 Starting backend..."
cd "$BACKEND_DIR"
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev &>/tmp/backend.log &
BACKEND_PID=$!

echo "⏳ Waiting for backend on port 8080..."
until curl -sf http://localhost:8080/v3/api-docs &>/dev/null; do sleep 2; done
echo "✅ Backend ready"

echo "⚡ Starting frontend..."
cd "$FRONTEND_DIR"
npm run dev &>/tmp/frontend.log &
FRONTEND_PID=$!

echo "⏳ Waiting for frontend on port 5173..."
until curl -sf http://localhost:5173 &>/dev/null; do sleep 1; done
echo "✅ Frontend ready"

echo "📸 Taking screenshots..."
cd "$SCRIPT_DIR"
npm install --silent
npx playwright install chromium --with-deps &>/dev/null
node take-screenshots.js

echo ""
echo "🧹 Cleaning up..."
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
docker compose -f "$BACKEND_DIR/docker-compose.yml" stop postgres

echo "✅ Done! Screenshots saved to docs/"
