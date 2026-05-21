# ⚡ Quick Start Guide

## 🎯 Get OTP Email Working in 5 Minutes

### Step 1️⃣: Get Gmail App Password (2 min)

1. Go to: https://myaccount.google.com/
2. Click **Security** (left sidebar)
3. Look for **"2-Step Verification"** → Enable if not active
4. Find **"App passwords"** (appears only after 2FA enabled)
5. Select: **Mail** → **Windows Computer**
6. Google shows **16-character password**
7. **Copy this password**

### Step 2️⃣: Update `.env` File (1 min)

Open: `/backend/.env`

Replace with your Gmail info:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your_actual_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=your_actual_email@gmail.com
```

**Example:**
```env
EMAIL_SERVICE=gmail
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=john.doe@gmail.com
```

### Step 3️⃣: Restart Backend (1 min)

Kill old backend and start fresh:

```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start backend
cd backend
PORT=8001 npm run dev
```

Check terminal shows: ✅ `Server running on port 8001`

### Step 4️⃣: Test It! (1 min)

1. Open: http://localhost:3001
2. Click **Sign Up**
3. Enter:
   - Name: Test User
   - Email: **your_actual_gmail@gmail.com**
   - Password: Test123
   - Role: Tenant
4. Submit
5. **Check your Gmail inbox** 📧
6. **Copy OTP** from email
7. Paste OTP in app
8. ✅ Account created!

---

## ✅ Verify Database

```bash
# Connect to MySQL
mysql -u root -p
# Enter password: root

# Check users
USE pg_management;
SELECT email, isVerified, createdAt FROM Users ORDER BY createdAt DESC;
```

You should see your new user with `isVerified = 1`

---

## 🚀 Servers Status

| What | URL | Port |
|------|-----|------|
| Frontend | http://localhost:3001 | 3001 |
| Backend | http://localhost:8001 | 8001 |
| MySQL | localhost | 3306 |

---

## 📋 Checklist

- [ ] Gmail app password copied
- [ ] `.env` file updated
- [ ] Backend restarted
- [ ] Frontend accessible at 3001
- [ ] Test email registered
- [ ] OTP received in inbox
- [ ] Account verified
- [ ] User visible in database

---

## 🆘 If It Doesn't Work

### Email Not Sending?
```
❌ Check 1: Gmail password is app password (16 chars, with spaces)
❌ Check 2: 2-Step Verification is enabled
❌ Check 3: Email in `.env` matches Gmail account
❌ Check 4: Look for errors in backend terminal
```

### Backend Won't Start?
```
❌ Check: Port 8001 is free (no other process using it)
❌ Check: MySQL is running
❌ Check: Database credentials in `.env` are correct
```

### Frontend Won't Load?
```
❌ Check: http://localhost:3001 loads
❌ Check: Browser console for errors (F12)
❌ Check: Backend API responds at port 8001
```

---

## 📞 Need Help?

1. **Check project docs:**
   - `SETUP_GUIDE.md` - Full setup details
   - `CHANGES_SUMMARY.md` - What was changed
   - `API_DOCUMENTATION.md` - API endpoints
   - `PROJECT_STATUS.md` - Current status

2. **Check backend logs:**
   - Email logs show in backend terminal
   - Database logs show connection status
   - Watch for 🚀 and ✅ symbols

3. **Test API directly:**
   - Use cURL or Postman
   - See API_DOCUMENTATION.md for examples

---

## 🎉 Success Indicators

✅ Backend terminal shows:
```
🚀 Server running on port 8001
📡 Socket.io ready for real-time messaging
✅ Database connected successfully
✅ All tables created/synced successfully
```

✅ Frontend shows:
```
✓ Ready in X.Xs
http://localhost:3001
```

✅ Email received with 6-digit OTP

✅ User appears in database:
```
mysql> SELECT email, isVerified FROM Users;
+------------------+------------+
| email            | isVerified |
+------------------+------------+
| test@gmail.com   |          1 |
+------------------+------------+
```

---

## 🎯 You're All Set!

Everything is ready to go. Just configure your Gmail and test!

**Questions?** Check the documentation files in the project root.
