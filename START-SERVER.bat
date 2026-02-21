@echo off
echo.
echo ===================================================================
echo   ComfortCare Agent System - Quick Start
echo ===================================================================
echo.

cd /d "C:\Users\ushsa\Desktop\comcare-agent"

echo Step 1: Installing dependencies...
echo.
call "C:\Program Files\nodejs\npm.cmd" install
echo.

if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    echo Please make sure you have Node.js and npm installed
    pause
    exit /b 1
)

echo.
echo Step 2: Starting API server on port 3001...
echo.
echo Server will run at: http://localhost:3001
echo.
echo Login Pages:
echo   Agent: http://localhost:3001/agent-login.html
echo   Admin: http://localhost:3001/admin-login.html
echo.
echo Press Ctrl+C to stop the server
echo.
echo ===================================================================
echo.

"C:\Program Files\nodejs\node.exe" api-server.js

pause
