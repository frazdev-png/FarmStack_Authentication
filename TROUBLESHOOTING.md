# TROUBLESHOOTING GUIDE

## Common Issues and Solutions

### Backend Issues

#### Issue: "Module not found" error when starting backend
**Symptoms:** 
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution:**
1. Make sure virtual environment is activated:
   ```bash
   # Windows
   venv\Scripts\activate.bat
   
   # macOS/Linux
   source venv/bin/activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Verify installation:
   ```bash
   pip list | grep fastapi
   ```

---

#### Issue: "MONGO_URI not set" error
**Symptoms:**
```
ValueError: MONGO_URI and DB_NAME must be set in .env file
```

**Solution:**
1. Check if .env file exists in taskflow-backend:
   ```bash
   ls .env    # macOS/Linux
   dir .env   # Windows
   ```

2. If missing, create it:
   ```bash
   cp .env.example .env   # macOS/Linux
   copy .env.example .env # Windows
   ```

3. Edit .env with your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=Cluster0
   DB_NAME=taskflow_db
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. Restart the backend server

---

#### Issue: Cannot connect to MongoDB
**Symptoms:**
```
pymongo.errors.ConnectionFailure: connection refused
```

**Possible Causes & Solutions:**
1. **MongoDB Atlas connection string is incorrect**
   - Copy the exact connection string from MongoDB Atlas dashboard
   - Replace `<password>` with your actual password
   - Include the database name if needed

2. **Network access is blocked**
   - Go to MongoDB Atlas → Security → Network Access
   - Add your IP address to the whitelist
   - Or use 0.0.0.0/0 for development (NOT recommended for production)

3. **MongoDB cluster is paused**
   - Check your MongoDB Atlas dashboard
   - Resume the cluster if it's paused

4. **Local MongoDB is not running**
   - If using local MongoDB: `mongod` on macOS/Linux or MongoDB service on Windows
   - Or use MongoDB Atlas (cloud)

---

#### Issue: "Invalid token" errors
**Symptoms:**
```
{
  "detail": "Invalid token"
}
```

**Solution:**
1. Check if SECRET_KEY in .env matches between restarts
2. Verify token hasn't expired (check ACCESS_TOKEN_EXPIRE_MINUTES)
3. Frontend should save token after login
4. Clear old tokens: `localStorage.clear()` in browser console

---

#### Issue: CORS errors
**Symptoms:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
1. Backend CORS is already configured to allow localhost:
   - localhost:5173 (Vite default)
   - localhost:3000 (alternative)
   - 127.0.0.1:5173 and 127.0.0.1:3000

2. If using different frontend URL, add it to main.py:
   ```python
   allow_origins=["your-frontend-url", ...existing_origins...]
   ```

3. Restart backend after changes

---

#### Issue: Port 8000 already in use
**Symptoms:**
```
OSError: [Errno 48] Address already in use
# or on Windows:
OSError: [WinError 10048] Only one usage of each socket address
```

**Solution:**
1. **Find and kill the process using port 8000:**
   ```bash
   # macOS/Linux
   lsof -i :8000
   kill -9 <PID>
   
   # Windows (PowerShell)
   Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess | Stop-Process
   ```

2. **Or use a different port:**
   ```bash
   uvicorn app.main:app --port 8001 --reload
   ```

---

### Frontend Issues

#### Issue: "Cannot find module 'axios'" or similar
**Symptoms:**
```
Error: Cannot find module 'axios'
```

**Solution:**
1. Install dependencies:
   ```bash
   npm install
   ```

2. Clear node_modules and reinstall (if issue persists):
   ```bash
   rm -rf node_modules package-lock.json   # macOS/Linux
   rmdir /s node_modules & del package-lock.json  # Windows
   npm install
   ```

---

#### Issue: "Port 5173 already in use"
**Symptoms:**
```
EADDRINUSE: address already in use :::5173
```

**Solution:**
1. Vite automatically tries the next port (5174, 5175, etc.)
2. Or kill the process:
   ```bash
   # macOS/Linux
   lsof -i :5173
   kill -9 <PID>
   
   # Windows (PowerShell)
   Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
   ```

---

#### Issue: API requests are failing
**Symptoms:**
```
GET http://localhost:8000/projects/ net::ERR_CONNECTION_REFUSED
```

**Solution:**
1. Verify backend is running on http://localhost:8000
   - Check if server is started
   - Check for error messages in backend terminal

2. Check frontend .env file:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. Verify token is being sent:
   - Open browser DevTools → Network tab
   - Check if Authorization header is present in requests
   - Look for "Bearer {token}" in header

4. Check CORS errors in browser console

---

#### Issue: "Cannot GET /login" or 404 errors on page reload
**Symptoms:**
```
Cannot GET /login
Cannot GET /dashboard
```

**Possible Causes:**
- SPA routing issue - Vite is not configured for SPA mode

**Solution:**
- The app should be working with current setup
- Clear browser cache: Ctrl+Shift+Del
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

---

#### Issue: Login token not persisting
**Symptoms:**
- User logs in successfully
- Token is not saved
- User is logged out after page refresh

**Solution:**
1. Check browser localStorage:
   - Open DevTools → Application → LocalStorage
   - Look for 'token' key
   - If empty, token is not being saved

2. Check auth.js file has setToken() being called:
   ```javascript
   // This should be called after successful login
   setToken(token)
   ```

3. Check if browser is blocking localStorage:
   - Incognito/Private mode may not support localStorage
   - Try on normal browsing mode

---

#### Issue: "License validation errors" or "Cannot read property"
**Symptoms:**
```
Cannot read property 'email' of undefined
```

**Solution:**
1. This usually means response format is incorrect
2. Check backend is returning correct response:
   ```json
   {
     "access_token": "token_here",
     "token_type": "bearer",
     "email": "user@example.com"
   }
   ```

3. Check browser DevTools → Network → login request
4. Verify response body format

---

### Database Issues

#### Issue: User is locked out of MongoDB Atlas
**Solution:**
1. Reset password on MongoDB Atlas
2. Update connection string in .env
3. Restart backend

---

#### Issue: Database queries are slow
**Possible Solutions:**
1. Add indexes on frequently queried fields
2. Optimize MongoDB queries
3. Use pagination for large result sets
4. Consider database optimization

---

### Development Environment

#### Issue: Node.js/Python not found
**Solution:**
1. **Python not found:**
   ```bash
   # Check installation
   python --version
   
   # If not found, install from https://www.python.org/
   # Make sure to add to PATH during installation
   ```

2. **Node.js not found:**
   ```bash
   # Check installation
   node --version
   npm --version
   
   # If not found, install from https://nodejs.org/
   ```

3. **Restart terminal/IDE after installation**

---

#### Issue: Virtual environment not activating
**Solution:**
1. Verify venv exists:
   ```bash
   # macOS/Linux
   ls venv
   
   # Windows
   dir venv
   ```

2. Try full path:
   ```bash
   # Windows
   C:\path\to\project\taskflow-backend\venv\Scripts\activate.bat
   ```

3. Use python directly:
   ```bash
   python -m pip install -r requirements.txt
   ```

---

### Deployment Issues

#### Issue: Backend won't start in production
**Solutions:**
1. Check all environment variables are set
2. Verify MongoDB connection from production server
3. Use Gunicorn for production:
   ```bash
   gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
   ```

---

#### Issue: Frontend build fails
**Solution:**
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json build dist
   npm install
   npm run build
   ```

2. Check for TypeScript errors:
   ```bash
   npm run lint
   ```

---

### Getting Help

If you encounter an issue not listed here:

1. **Check the console output:**
   - Frontend: Browser DevTools Console (F12)
   - Backend: Terminal where uvicorn is running

2. **Enable debug mode:**
   - Frontend: All logs are printed to console by default
   - Backend: Check for any error messages

3. **Check network requests:**
   - Browser DevTools → Network tab
   - Look for red requests
   - Check response body for error details

4. **Verify configuration:**
   - Check .env files have correct values
   - Ensure MongoDB credentials are correct
   - Verify frontend API URL matches backend

5. **Test API directly:**
   - Use Swagger UI at http://localhost:8000/docs
   - Try API calls with test data
   - Verify responses

---

### Additional Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **MongoDB Docs:** https://docs.mongodb.com/
- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/

---

**Last Updated:** February 8, 2026
