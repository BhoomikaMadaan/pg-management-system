# API Documentation - OTP Authentication

## Base URL
```
http://localhost:8001/api
```

---

## Authentication Endpoints

### 1. Register (Send OTP)

**Endpoint:** `POST /auth/register`

**Description:** Create new user account and send OTP to email

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "tenant"
}
```

**Success Response (201):**
```json
{
  "message": "Registration successful. OTP has been sent to your email.",
  "email": "john@example.com",
  "userId": 1
}
```

**Error Responses:**
- `400` - Invalid input or email already exists
- `500` - Server error (email not sent)

---

### 2. Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Description:** Verify OTP and activate account

**Request:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant"
  }
}
```

**Error Responses:**
- `400` - Invalid OTP or OTP expired
- `404` - User not found

---

### 3. Resend OTP

**Endpoint:** `POST /auth/resend-otp`

**Description:** Send new OTP to email (if expired)

**Request:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "OTP has been resent to your email"
}
```

**Error Responses:**
- `400` - Email already verified or user not found
- `500` - Failed to send email

---

### 4. Login

**Endpoint:** `POST /auth/login`

**Description:** Login with email and password (only for verified users)

**Request:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant"
  }
}
```

**Error Responses:**
- `400` - Email or password required
- `401` - Invalid email/password or email not verified
- `500` - Server error

---

## Database Schema

### Users Table

```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'tenant',
  otp VARCHAR(10),
  otpExpiry DATETIME,
  isVerified BOOLEAN DEFAULT FALSE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## Frontend Integration Example

### React/JavaScript

```javascript
// Register
async function register(name, email, password, role) {
  const response = await fetch('http://localhost:8001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  return response.json();
}

// Verify OTP
async function verifyOTP(email, otp) {
  const response = await fetch('http://localhost:8001/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp })
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}

// Login
async function login(email, password) {
  const response = await fetch('http://localhost:8001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
}
```

---

## Error Codes Reference

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid credentials |
| 404 | Not Found - User doesn't exist |
| 500 | Server Error |

---

## Security Notes

1. **Passwords:** All passwords are hashed using bcryptjs
2. **Email:** All emails stored in lowercase
3. **OTP:** 6-digit code, expires in 10 minutes
4. **JWT Token:** Expires in 24 hours
5. **Verification:** Email verification required before login

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123",
    "role": "tenant"
  }'
```

### Verify OTP
```bash
curl -X POST http://localhost:8001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123"
  }'
```

---

## Postman Collection

Import this into Postman:

```json
{
  "info": {
    "name": "PG Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register",
      "request": {
        "method": "POST",
        "url": "http://localhost:8001/api/auth/register",
        "body": {
          "mode": "raw",
          "raw": "{\"name\": \"John\", \"email\": \"john@test.com\", \"password\": \"Test123\", \"role\": \"tenant\"}"
        }
      }
    },
    {
      "name": "Verify OTP",
      "request": {
        "method": "POST",
        "url": "http://localhost:8001/api/auth/verify-otp",
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"john@test.com\", \"otp\": \"123456\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:8001/api/auth/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"john@test.com\", \"password\": \"Test123\"}"
        }
      }
    }
  ]
}
```
