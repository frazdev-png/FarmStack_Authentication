@echo off
REM Script to start both Backend and Frontend

echo.
echo ========================================
echo   Starting TaskFlow Application
echo ========================================
echo.

REM Start Backend
echo Starting Backend Server...
cd taskflow-backend
call venv\Scripts\activate.bat
start cmd /k "title TaskFlow Backend && uvicorn app.main:app --reload"

REM Wait a moment for backend to start
timeout /t 2 /nobreak

REM Start Frontend
echo Starting Frontend Server...
cd ..\frontend
start cmd /k "title TaskFlow Frontend && npm run dev"

echo.
echo ========================================
echo   Servers Starting
echo ========================================
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo API Docs: http://localhost:8000/docs
echo.
pause
