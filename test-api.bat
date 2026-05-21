@echo off
REM API Testing Script for PG Management System (Windows)
REM Tests: Registration, Login, and Database persistence

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:8001/api/auth
set DB_USER=root
set DB_PASS=root

echo ===================================
echo PG Management System - API Tests
echo ===================================
echo.

REM Test 1: Registration
echo 1. Testing User Registration...
echo Request: POST %BASE_URL%/register
echo.

curl -X POST %BASE_URL%/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Test User\", \"email\": \"test@example.com\", \"password\": \"Test123\", \"role\": \"tenant\"}"

echo.
echo.

REM Test 2: Login
echo 2. Testing User Login...
echo Request: POST %BASE_URL%/login
echo.

curl -X POST %BASE_URL%/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"test@example.com\", \"password\": \"Test123\"}"

echo.
echo.

REM Test 3: Backend Status
echo 3. Testing Backend Status...
echo Request: GET http://localhost:8001/
echo.

curl -I http://localhost:8001/

echo.
echo.

REM Test 4: Frontend Status
echo 4. Testing Frontend Status...
echo URL: http://localhost:3001
echo.

curl -I http://localhost:3001/

echo.
echo ===================================
echo Tests completed!
echo ===================================
echo.
echo Next steps:
echo 1. Check responses above for "Account created successfully" and token
echo 2. Open http://localhost:3001 in your browser
echo 3. Test registration and login on the web interface
echo 4. Check MySQL database: mysql -u root -p
echo    Then: USE pg_management; SELECT * FROM Users;
echo.
pause
