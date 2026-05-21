# PG Management System - Setup Guide

## ✅ What's Been Fixed

### 1. **Email OTP Authentication Added**
- Users now receive OTP on their email during registration
- OTP-based email verification before account activation
- Resend OTP functionality if needed

### 2. **Database Persistence Fixed**
- User model updated with OTP fields and verification status
- All data now properly saved to MySQL database
- Removed in-memory fallback that was preventing database storage
- Environment variables for secure database configuration

### 3. **Email Case-Sensitivity Fixed**
- Email comparisons are now case-insensitive
- Emails stored in lowercase for consistency

---

## 📧 Email Configuration (IMPORTANT)

### Step 1: Update `.env` file in `/backend` folder

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=pg_management

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# JWT
JWT_SECRET=supersecretkey

# Server
PORT=8000
```

### Step 2: Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" (if not already enabled)
4. In Security settings, find "App passwords"
5. Select "Mail" and "Windows Computer"
6. Copy the generated 16-character password
7. Paste it in `.env` as `EMAIL_PASSWORD`

**Example:**
```env
EMAIL_USER=yourname@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## 🗄️ New Database Schema

The User table now includes:
- `otp` - 6-digit OTP sent to email
- `otpExpiry` - OTP expiration time (10 minutes)
- `isVerified` - User email verification status (true/false)

---

## 📡 New API Endpoints

### 1. **Register (Send OTP)**
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "tenant"
}

Response: {
  "message": "Registration successful. OTP has been sent to your email.",
  "email": "john@example.com",
  "userId": 1
}
```

### 2. **Verify OTP**
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}

Response: {
  "message": "Email verified successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant"
  }
}
```

### 3. **Resend OTP**
```
POST /api/auth/resend-otp
Content-Type: application/json

{
  "email": "john@example.com"
}

Response: {
  "message": "OTP has been resent to your email"
}
```

### 4. **Login (Only Verified Users)**
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: {
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "tenant"
  }
}
```

---

## 🚀 Running the Project

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
✅ Backend runs on: http://localhost:8000

### Terminal 2: Frontend
```bash
cd pg-animated-frontend
npm run dev
```
✅ Frontend runs on: http://localhost:3000

---

## 🧪 Testing the Registration Flow

1. **Go to:** http://localhost:3000 (Frontend)
2. **Create Account** with:
   - Name: Test User
   - Email: yourname@gmail.com (or your test email)
   - Password: Test123
   - Role: Tenant
3. **Check your email** for OTP
4. **Enter OTP** on the verification page
5. **Login** with your email and password
6. **Check MySQL Database:**
   ```sql
   SELECT * FROM Users;
   ```
   ✅ You should see the new user with `isVerified = true`

---

## 📂 New/Updated Files

### Created:
- `/backend/.env` - Environment variables
- `/backend/services/mailService.js` - Email sending service

### Updated:
- `/backend/models/User.js` - Added OTP fields and isVerified
- `/backend/config/database.js` - Environment variables support
- `/backend/controllers/authController.js` - OTP registration flow
- `/backend/routes/authRoutes.js` - New OTP endpoints

---

## 🔍 Database Check

To verify data is being saved to MySQL:

```bash
# Connect to MySQL
mysql -u root -p

# Use the database
USE pg_management;

# Check users
SELECT id, name, email, isVerified, createdAt FROM Users;
```

---

## ⚠️ Important Notes

1. **OTP Expiry:** OTP expires in 10 minutes
2. **Email Service:** Make sure to use Gmail App Password, not regular password
3. **Database:** Ensure MySQL is running and database `pg_management` exists
4. **Port Conflicts:** If port 8000/3000 is in use, modify PORT in `.env`

---

## 🐛 Troubleshooting

### Email Not Sending?
- Verify Gmail app password is correct
- Check if 2-Step Verification is enabled
- Look for error in backend terminal

### Data Not Saving to Database?
- Check MySQL connection in backend terminal
- Verify `pg_management` database exists
- Check database credentials in `.env`

### OTP Verification Failing?
- Verify OTP hasn't expired (10 minutes max)
- Check email spelling matches registration
- Use resend OTP endpoint if needed

---

✅ **All fixes complete! Configure email and restart backend to test.**
