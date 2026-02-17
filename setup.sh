#!/bin/bash

# Setup script for TaskFlow Application on macOS/Linux

echo ""
echo "========================================"
echo "  TaskFlow Application Setup Script"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Python and Node.js found"
echo ""
echo "Setting up Backend..."
echo ""

# Setup Backend
cd taskflow-backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt -q

# Check if .env exists
if [ ! -f ".env" ]; then
    echo ""
    echo "WARNING: .env file not found in taskflow-backend"
    echo "Please copy .env.example to .env and update with your MongoDB connection"
    echo "Run: cp .env.example .env"
    echo ""
    read -p "Press enter to continue..."
fi

echo ""
echo "✅ Backend setup complete"
echo ""
echo "Setting up Frontend..."
echo ""

# Setup Frontend
cd ../frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install -q

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env from example..."
    cp .env.example .env
fi

echo ""
echo "✅ Frontend setup complete"
echo ""
echo "========================================"
echo "   Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend:"
echo "   cd taskflow-backend"
echo "   source venv/bin/activate"
echo "   uvicorn app.main:app --reload"
echo ""
echo "2. In a new terminal, start Frontend:"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open browser to http://localhost:5173"
echo ""
echo "========================================"
echo ""
