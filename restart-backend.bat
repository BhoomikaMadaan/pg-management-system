@echo off
REM Kill all node processes
echo Killing existing Node processes...
taskkill /F /IM node.exe /T 2>nul

REM Wait for processes to terminate
timeout /t 2 /nobreak

REM Start backend
echo Starting backend server...
cd backend
npm run dev
pause
