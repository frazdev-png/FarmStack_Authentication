@echo off
REM Setup script for TaskFlow Application on Windows

echo.
echo ========================================
echo   TaskFlow Application Setup Script
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Python and Node.js found
echo.
echo Setting up Backend...
echo.

REM Setup Backend
cd taskflow-backend

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt -q

REM Check if .env exists, if not copy from example
if not exist .env (
    echo.
    echo WARNING: .env file not found in taskflow-backend
    echo Please copy .env.example to .env and update with your MongoDB connection
    echo Example: 
    echo   copy .env.example .env
    echo.
    pause
)

echo.
echo ✅ Backend setup complete
echo.
echo Setting up Frontend...
echo.

REM Setup Frontend
cd ..\frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install -q

REM Check if .env exists, if not copy from example
if not exist .env (
    echo Creating .env from example...
    copy .env.example .env
)

echo.
echo ✅ Frontend setup complete
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start Backend:
echo    cd taskflow-backend
echo    venv\Scripts\activate.bat
echo    uvicorn app.main:app --reload
echo.
echo 2. In a new terminal, start Frontend:
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open browser to http://localhost:5173
echo.
echo ========================================
echo.
pause
