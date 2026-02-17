#!/bin/bash

# Script to start both Backend and Frontend on macOS/Linux

echo ""
echo "========================================"
echo "   Starting TaskFlow Application"
echo "========================================"
echo ""

# Start Backend in background
echo "Starting Backend Server..."
cd taskflow-backend
source venv/bin/activate
uvicorn app.main:app --reload &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start Frontend
echo "Starting Frontend Server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "   Servers Starting"
echo "========================================"
echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo ""
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for both processes
wait
