#!/bin/bash

# API Testing Script for PG Management System
# Tests: Registration, Login, and Database persistence

BASE_URL="http://localhost:8001/api/auth"
DB_USER="root"
DB_PASS="root"

echo "==================================="
echo "PG Management System - API Tests"
echo "==================================="
echo ""

# Test 1: Registration
echo "📝 TEST 1: User Registration"
echo "Request: POST $BASE_URL/register"
echo ""

REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123",
    "role": "tenant"
  }')

echo "Response:"
echo "$REGISTER_RESPONSE" | jq . 2>/dev/null || echo "$REGISTER_RESPONSE"
echo ""

# Extract token from response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ ! -z "$TOKEN" ]; then
  echo "✅ Registration successful! Token received."
  echo "Token: $TOKEN"
  echo ""
else
  echo "❌ Registration failed or token not received"
  echo ""
fi

# Test 2: Login
echo "🔐 TEST 2: User Login"
echo "Request: POST $BASE_URL/login"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }')

echo "Response:"
echo "$LOGIN_RESPONSE" | jq . 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

LOGIN_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$LOGIN_TOKEN" != "null" ] && [ ! -z "$LOGIN_TOKEN" ]; then
  echo "✅ Login successful!"
  echo ""
else
  echo "❌ Login failed"
  echo ""
fi

# Test 3: Database Check
echo "🗄️  TEST 3: Database Verification"
echo "Command: SELECT COUNT(*) FROM Users;"
echo ""

# Check if mysql client is available
if command -v mysql &> /dev/null; then
  DB_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASS" -e "USE pg_management; SELECT COUNT(*) FROM Users;" 2>/dev/null | tail -1)
  echo "Total users in database: $DB_COUNT"
  echo ""

  echo "Users in database:"
  mysql -u "$DB_USER" -p"$DB_PASS" -e "USE pg_management; SELECT id, name, email, role, isVerified, createdAt FROM Users;" 2>/dev/null
  echo ""
else
  echo "⚠️  MySQL client not available. Please check database manually."
  echo "Run: mysql -u root -p"
  echo "Then: USE pg_management; SELECT * FROM Users;"
  echo ""
fi

# Test 4: Backend Status
echo "🚀 TEST 4: Backend Status"
echo "Request: GET http://localhost:8001/"
echo ""

BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/)
if [ "$BACKEND_STATUS" == "200" ]; then
  echo "✅ Backend is running and responding"
else
  echo "❌ Backend not responding (Status: $BACKEND_STATUS)"
fi
echo ""

# Test 5: Frontend Status
echo "🌐 TEST 5: Frontend Status"
echo "URL: http://localhost:3001"
echo ""

FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/)
if [ "$FRONTEND_STATUS" == "200" ]; then
  echo "✅ Frontend is running and responding"
else
  echo "⚠️  Frontend status: $FRONTEND_STATUS"
fi
echo ""

echo "==================================="
echo "✅ All tests completed!"
echo "==================================="
echo ""
echo "Summary:"
echo "- If registration shows 'Account created successfully', database is working"
echo "- If login shows a token, authentication is working"
echo "- If users appear in database, data persistence is working"
echo ""
echo "Next: Open http://localhost:3001 and test the web interface"
