# 🚀 WASCO Deployment Guide - Render.com (Free)

## 📋 **Prerequisites**

Before we start, you need:
1. ✅ GitHub account (free) - https://github.com
2. ✅ Render.com account (free) - https://render.com
3. ✅ Your application code ready

---

## 🎯 **Deployment Strategy**

We'll deploy in this order:
1. **Backend API** → Render.com Web Service
2. **PostgreSQL Database** → Render.com PostgreSQL (Free)
3. **MySQL Database** → FreeSQLDatabase.com or Render.com
4. **Frontend** → Render.com Static Site

---

## 📦 **STEP 1: Prepare Your Code for Deployment**

### 1.1 Create Production Environment File

Create `backend/.env.production`:

```env
# Production Environment Variables
NODE_ENV=production
PORT=10000

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRE=24h

# Stripe (use test keys for now)
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here

# Database URLs (will be provided by Render)
MYSQL_URL=mysql://user:password@host:port/database
POSTGRES_URL=postgresql://user:password@host:port/database

# CORS
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### 1.2 Update package.json Scripts

Add to `backend/package.json`:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "build": "echo 'No build step required'"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 1.3 Create Render Configuration

Create `backend/render.yaml`:

```yaml
services:
  - type: web
    name: wasco-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
```

---

## 🗄️ **STEP 2: Set Up Databases on Render**

### 2.1 Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - **Name:** `wasco-analytics`
   - **Database:** `wasco_analytics`
   - **User:** `wasco_user`
   - **Region:** Choose closest to you
   - **Plan:** Free
4. Click "Create Database"
5. **SAVE** the connection details:
   - Internal Database URL
   - External Database URL
   - Username
   - Password

### 2.2 Import PostgreSQL Schema

1. Download and install pgAdmin or use Render's console
2. Connect using the External Database URL
3. Run your schema:
   ```sql
   -- Copy contents from backend/src/database/postgresql_schema.sql
   ```

### 2.3 MySQL Database Options

**Option A: FreeSQLDatabase.com (Easiest)**
1. Go to https://www.freesqldatabase.com
2. Sign up for free account
3. Create database: `wasco_db`
4. **SAVE** connection details:
   - Host
   - Port
   - Username
   - Password
   - Database name

**Option B: Render MySQL (Paid - $7/month)**
- Similar to PostgreSQL setup above

### 2.4 Import MySQL Schema

1. Use MySQL Workbench or phpMyAdmin
2. Connect to your MySQL database
3. Run your schema:
   ```sql
   -- Copy contents from backend/src/database/mysql_schema_simple.sql
   ```

---

## 🔧 **STEP 3: Push Code to GitHub**

### 3.1 Initialize Git (if not already done)

```bash
cd "C:\Users\hp\Documents\Database Applications\WascoBS"

# Initialize git
git init

# Create .gitignore
echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo "*.log" >> .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit - WASCO Water Bill Management System"
```

### 3.2 Create GitHub Repository

1. Go to https://github.com
2. Click "New repository"
3. Name: `wasco-water-billing`
4. Description: "Distributed Water Bill Management System for WASCO Lesotho"
5. Public or Private (your choice)
6. Click "Create repository"

### 3.3 Push to GitHub

```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/wasco-water-billing.git

# Push code
git branch -M main
git push -u origin main
```

---

## 🚀 **STEP 4: Deploy Backend to Render**

### 4.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select `wasco-water-billing` repository
5. Fill in:
   - **Name:** `wasco-backend`
   - **Region:** Choose closest
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### 4.2 Add Environment Variables

In the "Environment" section, add:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=your-super-secret-jwt-key-2024-change-this
JWT_EXPIRE=24h

# MySQL Connection (from Step 2.3)
MYSQL_HOST=your-mysql-host
MYSQL_PORT=3306
MYSQL_USER=your-mysql-user
MYSQL_PASSWORD=your-mysql-password
MYSQL_DATABASE=wasco_db
MYSQL_POOL_MIN=2
MYSQL_POOL_MAX=5

# PostgreSQL Connection (from Step 2.1)
POSTGRES_HOST=your-postgres-host
POSTGRES_PORT=5432
POSTGRES_USER=your-postgres-user
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DATABASE=wasco_analytics
POSTGRES_POOL_MIN=2
POSTGRES_POOL_MAX=5

# Stripe (use test keys)
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key

# CORS (will update after frontend deployment)
FRONTEND_URL=*
```

### 4.3 Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for deployment
3. Your backend will be at: `https://wasco-backend.onrender.com`

### 4.4 Test Backend

Open in browser:
```
https://wasco-backend.onrender.com/health
```

Should return:
```json
{
  "status": "healthy",
  "mysql": "connected",
  "postgresql": "connected"
}
```

---

## 🌐 **STEP 5: Deploy Frontend to Render**

### 5.1 Update Frontend API URL

Edit `frontend/src/utils/api.js`:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://wasco-backend.onrender.com/api';
```

### 5.2 Add Build Script

Update `frontend/package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "serve": "serve -s build"
  }
}
```

### 5.3 Create Static Site on Render

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect same GitHub repository
4. Fill in:
   - **Name:** `wasco-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

### 5.4 Add Environment Variable

```
REACT_APP_API_URL=https://wasco-backend.onrender.com/api
```

### 5.5 Deploy

1. Click "Create Static Site"
2. Wait 5-10 minutes
3. Your frontend will be at: `https://wasco-frontend.onrender.com`

---

## 🔄 **STEP 6: Update CORS Settings**

### 6.1 Update Backend Environment

Go back to your backend service on Render and update:

```
FRONTEND_URL=https://wasco-frontend.onrender.com
```

### 6.2 Redeploy Backend

Click "Manual Deploy" → "Deploy latest commit"

---

## ✅ **STEP 7: Verify Deployment**

### 7.1 Test Backend

```
https://wasco-backend.onrender.com/health
https://wasco-backend.onrender.com/api/customers/districts
```

### 7.2 Test Frontend

```
https://wasco-frontend.onrender.com
```

### 7.3 Test Full Flow

1. Open frontend URL
2. Try to register/login
3. Check if API calls work

---

## ⚠️ **Important Notes**

### Free Tier Limitations

1. **Backend sleeps after 15 minutes of inactivity**
   - First request takes 30-60 seconds to wake up
   - Subsequent requests are fast

2. **750 hours/month free**
   - Enough for demonstration and testing

3. **Databases:**
   - PostgreSQL: 90 days free, then expires
   - MySQL: Depends on provider

### For Your Demonstration

1. **Wake up services before demo:**
   - Visit your URLs 2-3 minutes before presenting
   - This ensures they're active

2. **Have backup:**
   - Keep localhost version ready
   - In case of internet issues

---

## 🎓 **For Your Lecturer**

### Provide These URLs

```
Frontend: https://wasco-frontend.onrender.com
Backend API: https://wasco-backend.onrender.com
API Health: https://wasco-backend.onrender.com/health
API Docs: https://wasco-backend.onrender.com/api

GitHub Repository: https://github.com/YOUR_USERNAME/wasco-water-billing
```

### Documentation to Submit

1. This deployment guide
2. GitHub repository link
3. Live application URLs
4. API endpoint documentation
5. Database schema files

---

## 🐛 **Troubleshooting**

### Backend Won't Start

1. Check logs in Render dashboard
2. Verify environment variables
3. Check database connections
4. Ensure Node version is correct

### Database Connection Errors

1. Verify connection strings
2. Check if databases are active
3. Ensure IP whitelist (if required)
4. Test connections locally first

### Frontend Can't Reach Backend

1. Check CORS settings
2. Verify API_URL is correct
3. Check browser console for errors
4. Ensure backend is awake

---

## 📞 **Need Help?**

If you encounter issues:
1. Check Render logs
2. Test locally first
3. Verify all environment variables
4. Check database connections

---

## 🎉 **Success Checklist**

- [ ] Backend deployed and accessible
- [ ] PostgreSQL database created and schema imported
- [ ] MySQL database created and schema imported
- [ ] Frontend deployed and accessible
- [ ] API calls working from frontend
- [ ] All environment variables set
- [ ] CORS configured correctly
- [ ] GitHub repository public/accessible
- [ ] Documentation ready for submission

---

**Your WASCO application will be live and accessible from anywhere in the world!** 🌍🚀💧