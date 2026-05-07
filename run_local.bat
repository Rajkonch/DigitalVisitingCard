@echo off
echo Starting Digital Visiting Card Project...

start cmd /k "cd backend && npm run dev"
start cmd /k "cd next-frontend && npm run dev"

echo.
echo Both servers are starting in new windows.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
pause
