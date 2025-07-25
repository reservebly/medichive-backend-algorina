@echo off
echo 🚀 Starting MediChive Backend Server...
echo.

REM Kill any existing Node processes to free up port 3000
echo 🔄 Cleaning up any existing processes...
taskkill /f /im node.exe >nul 2>&1

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Check if port 3000 is free and kill any process using it
echo 🔍 Checking port 3000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo 🔪 Killing process %%a using port 3000...
    taskkill /PID %%a /F >nul 2>&1
)

REM Build the project
echo 🔨 Building the project...
call npm run build

REM Start the server
echo 🌐 Starting server on port 3000...
call npm start

pause
