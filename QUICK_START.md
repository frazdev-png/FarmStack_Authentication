# 🚀 TaskFlow - Quick Start Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB (local or Atlas account)
- Git

## ⚡ 5-Minute Quick Start

### 1️⃣ First Time Setup

**Windows:**
```bash
cd path\to\Authentication
setup.bat
```

**macOS/Linux:**
```bash
cd path/to/Authentication
chmod +x setup.sh
./setup.sh
```

### 2️⃣ Configure MongoDB

1. If using **MongoDB Atlas** (cloud):
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a free cluster
   - Get connection string from "Connect" button
   - Update `.env` file in `taskflow-backend/` with your connection string

2. If using **Local MongoDB**:
   - Install MongoDB from https://www.mongodb.com/try/download/community
   - Start MongoDB service
   - Connection string: `mongodb://localhost:27017`

### 3️⃣ Start Backend

**Terminal 1:**
```bash
cd taskflow-backend

# Windows
venv\Scripts\activate.bat

# macOS/Linux
source venv/bin/activate

# Run server
uvicorn app.main:app --reload
```

✅ Server running at: http://localhost:8000

### 4️⃣ Start Frontend

**Terminal 2:**
```bash
cd frontend
npm run dev
```

✅ App running at: http://localhost:5173

### 5️⃣ Use the Application

1. Open browser to http://localhost:5173
2. Click "Sign Up" to create an account
3. Enter email and password (min 6 characters)
4. Create and manage your projects!

---

## 📚 After Setup

### Common Commands

**View API Documentation:**
- Visit: http://localhost:8000/docs

**Restart Application:**
```bash
# Windows
start.bat

# macOS/Linux
chmod +x start.sh
./start.sh
```

**Stop Application:**
- Press `Ctrl+C` in both terminals

---

## 🔍 Testing

### Test Login/Signup Flow
1. Go to http://localhost:5173
2. Click "Sign Up"
3. Enter test@example.com and password123
4. Click "Create Account"
5. Should redirect to login
6. Click "Login" and enter credentials
7. Should go to Dashboard

### Test Project Management
1. Click "New Project"
2. Enter project name and description
3. Click "Create"
4. Click project to add/manage tasks

### Test API Directly
Visit http://localhost:8000/docs for interactive Swagger UI

---

## ❌ Common Issues

### Port Already in Use
```bash
# Kill process using port 8000
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process

# macOS/Linux
lsof -i :8000 | awk 'NR!=1 {print $2}' | xargs kill -9
```

### MongoDB Connection Error
1. Check .env file has MONGO_URI
2. Verify MongoDB credentials
3. Check network access (MongoDB Atlas)
4. Restart backend

### Frontend API Errors
1. Check backend is running on http://localhost:8000
2. Clear browser localStorage: `localStorage.clear()`
3. Hard refresh browser: `Ctrl+Shift+R`

📖 See **TROUBLESHOOTING.md** for more issues and solutions

---

## 📁 Project Structure

```
Authentication/
├── frontend/                 # React Vite App
│   ├── src/
│   ├── .env                 # Frontend config
│   ├── package.json
│   └── vite.config.js
├── taskflow-backend/        # FastAPI Server
│   ├── app/
│   ├── .env                 # Backend config
│   ├── requirements.txt
│   └── main.py
├── README.md               # Full documentation
├── setup.bat/.sh           # Automatic setup
└── start.bat/.sh           # Start both servers
```

---

## 📖 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Full project documentation |
| `API_DOCUMENTATION.md` | API endpoints & examples |
| `TROUBLESHOOTING.md` | Common issues & solutions |
| `setup.bat/.sh` | Automatic environment setup |
| `start.bat/.sh` | Start both servers |

---

## 💡 Tips

- **Frontend:** Runs on http://localhost:5173 with hot reload
- **Backend:** Runs on http://localhost:8000 with auto-reload
- **API Docs:** Available at http://localhost:8000/docs (Swagger UI)
- **Database:** All data sent to MongoDB Atlas or local MongoDB

---

## 🔐 Security Notes

- Never commit `.env` file to git
- Change SECRET_KEY before production
- Use strong MongoDB password
- Keep dependencies updated

---

## 🆘 Need Help?

1. Check **TROUBLESHOOTING.md** for common issues
2. Review **API_DOCUMENTATION.md** for endpoint details
3. Check browser console for frontend errors
4. Check terminal for backend errors

---

## ✨ Features

- 🔐 Secure JWT authentication
- 📊 Create and manage projects
- ✅ Create and track tasks
- 🔒 User data isolation
- 🎨 Modern UI with Tailwind CSS
- ⚡ Fast FastAPI backend

---

**Happy Coding! 🎉**

For detailed information, see the main [README.md](README.md)
