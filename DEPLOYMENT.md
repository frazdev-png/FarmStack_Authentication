# 🌐 TaskFlow - Deployment Guide

Guide for deploying TaskFlow to production environments.

---

## Prerequisites for Production

- Linux/Ubuntu server (recommended)
- Python 3.8+
- Node.js 16+
- MongoDB Atlas account or managed MongoDB
- Domain name (optional but recommended)
- SSL certificate (recommended)

---

## Backend Deployment (FastAPI + Gunicorn)

### Step 1: Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, pip, and virtual environment
sudo apt install python3 python3-pip python3-venv -y

# Install Git
sudo apt install git -y

# Create app directory
sudo mkdir -p /var/www/taskflow
sudo cd /var/www/taskflow
```

### Step 2: Clone Repository

```bash
git clone <your-repo-url> .
cd taskflow-backend
```

### Step 3: Set Up Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

### Step 4: Configure Environment Variables

```bash
nano .env
```

Add production values:
```
MONGO_URI=mongodb+srv://prod_user:prod_password@cluster.mongodb.net/?appName=prod
DB_NAME=taskflow_prod
SECRET_KEY=your-very-long-random-secret-key-here-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Generate a strong SECRET_KEY:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 5: Create Systemd Service

```bash
sudo nano /etc/systemd/system/taskflow-backend.service
```

Add content:
```ini
[Unit]
Description=TaskFlow FastAPI Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/taskflow/taskflow-backend
Environment="PATH=/var/www/taskflow/taskflow-backend/venv/bin"
ExecStart=/var/www/taskflow/taskflow-backend/venv/bin/gunicorn \
    app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Step 6: Enable and Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl enable taskflow-backend
sudo systemctl start taskflow-backend

# Check status
sudo systemctl status taskflow-backend

# View logs
sudo journalctl -u taskflow-backend -f
```

---

## Frontend Deployment

### Step 1: Build Frontend

```bash
cd /var/www/taskflow/frontend
nvm install 16    # or use your Node version manager
npm install
npm run build
```

### Step 2: Install Nginx

```bash
sudo apt install nginx -y
```

### Step 3: Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/taskflow
```

Add configuration:
```nginx
upstream backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    
    # Frontend
    location / {
        root /var/www/taskflow/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api/ {
        proxy_pass http://backend/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss;
}
```

### Step 4: Enable SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

### Step 5: Enable Nginx Site

```bash
sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/taskflow
sudo chmod -R 755 /var/www/taskflow
```

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Create organization and project
3. Create M0 (free) or larger cluster
4. Create database user
5. Allow network access (your server IP or 0.0.0.0/0 for flexibility)

### Step 2: Get Connection String

1. Click "Connect" button
2. Choose "Connect Your Application"
3. Copy connection string
4. Add to backend .env as MONGO_URI

---

## Frontend Environment Configuration

Update frontend .env for production:

```
VITE_API_BASE_URL=https://yourdomain.com/api
```

Rebuild frontend after updating:
```bash
cd frontend
npm run build
```

---

## Monitoring & Maintenance

### View Backend Logs

```bash
sudo journalctl -u taskflow-backend -n 100 -f
```

### Backup Database

```bash
# Manual backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/taskflow_prod"

# Scheduled backup (add to crontab)
0 2 * * * /usr/local/bin/mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/taskflow_prod" --out /backups/$(date +\%Y-\%m-\%d)
```

### Update Application

```bash
cd /var/www/taskflow
git pull origin main

# Backend
cd taskflow-backend
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart taskflow-backend

# Frontend
cd ../frontend
npm install
npm run build
sudo systemctl reload nginx
```

### SSL Certificate Renewal

```bash
# Auto-renewal (should be automatic with Let's Encrypt)
sudo certbot renew --dry-run

# Manual renewal
sudo certbot renew
```

---

## Security Checklist

- ✅ Use HTTPS/SSL certificates
- ✅ Set strong SECRET_KEY
- ✅ MongoDB user authentication enabled
- ✅ Firewall configured (only allow 80, 443, 22)
- ✅ SSH key authentication (no password login)
- ✅ Regular backups enabled
- ✅ Update environment variables before deploy
- ✅ Set restrictive file permissions
- ✅ Use environment variables for all secrets
- ✅ Enable rate limiting (can be added to Nginx)
- ✅ Set CORS origins to specific domains (not *)

---

## Performance Optimization

### Backend
```python
# In main.py, add caching
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend
from redis import asyncio as aioredis

# Initialize cache for faster lookups
```

### Frontend
- Minification: `npm run build` does this
- Code splitting: Already configured in Vite
- Image optimization: Use CDN for assets
- Lazy loading: Implement in routes

### Server
- Enable Gzip compression (configured in Nginx above)
- Use CDN for static assets
- Enable browser caching headers
- Use HTTP/2

---

## Troubleshooting Production

### Backend Won't Start
```bash
sudo journalctl -u taskflow-backend -n 50
# Check .env file
# Verify MongoDB connection
# Check file permissions
```

### Frontend Not Loading
```bash
# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Verify frontend files exist
ls -la /var/www/taskflow/frontend/dist/
```

### API Calls Failing
```bash
# Check backend service
sudo systemctl status taskflow-backend

# Test backend directly
curl http://127.0.0.1:8000/

# Check Nginx proxy configuration
```

### High Resource Usage
```bash
# Monitor processes
top

# Check logs for errors
sudo journalctl -u taskflow-backend -n 100

# Increase Gunicorn workers if CPU available
# Decrease if memory is limited
```

---

## Scaling Considerations

### For High Traffic

1. **Load Balancer:**
   - Use Nginx as load balancer
   - Run multiple Gunicorn instances
   - Or use AWS ELB, Google Cloud LB

2. **Multiple Backend Instances:**
   ```bash
   # Run on different ports (8000, 8001, 8002)
   # Configure Nginx to round-robin
   ```

3. **Caching:**
   - Implement Redis cache
   - Cache API responses
   - Reduce database queries

4. **Database:**
   - Use MongoDB Atlas with auto-scaling
   - Enable read replicas
   - Regular index optimization

5. **Frontend:**
   - Use CDN (Cloudflare, AWS CloudFront)
   - Enable browser caching
   - Optimize bundle size

---

## Cost Optimization

### Free Resources
- MongoDB Atlas free tier (512MB)
- Let's Encrypt SSL (free)
- Nginx (free, open source)
- Linux (free, open source)

### Recommended Setup (Low Cost)
- **Server:** $5-10/month (DigitalOcean, Linode, Vultr)
- **MongoDB Atlas:** Free tier
- **Domain:** $10-15/year
- **Total:** ~$150-180/year

### When to Upgrade
- MongoDB: When you exceed 512MB data
- Server: When CPU/Memory becomes limiting
- Infrastructure: When you need redundancy/failover

---

## Backup & Recovery

### Automated Backups
```bash
# Add to crontab for daily backups at 2 AM
0 2 * * * /home/ubuntu/backup.sh

# Create /home/ubuntu/backup.sh:
#!/bin/bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/taskflow_prod" \
    --out /backups/$(date +\%Y-\%m-\%d)
tar -czf /backups/frontend-$(date +\%Y-\%m-\%d).tar.gz /var/www/taskflow/frontend/dist/
```

### Database Recovery
```bash
# Restore from backup
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/taskflow_prod" \
    /backups/backup-date/
```

---

## Post-Deployment Checklist

- ✅ Backend service running and auto-starting
- ✅ Frontend serving correctly
- ✅ SSL certificate active and renewed automatically
- ✅ MongoDB backups configured
- ✅ Domain pointing to server
- ✅ Email notifications for important events
- ✅ Monitoring set up
- ✅ Documentation updated
- ✅ Admin access secured
- ✅ Load testing completed

---

## Support & Resources

- FastAPI Production: https://fastapi.tiangolo.com/deployment/
- Gunicorn: https://gunicorn.org/
- Nginx: https://nginx.org/
- MongoDB Operational Best Practices: https://docs.mongodb.com/
- Let's Encrypt: https://letsencrypt.org/
- DigitalOcean Guides: https://www.digitalocean.com/community/tutorials

---

**Last Updated:** February 8, 2026

**Remember:** Always test in staging before deploying to production!
