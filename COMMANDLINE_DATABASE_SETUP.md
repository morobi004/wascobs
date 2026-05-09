# WASCO - Command Line Database Setup Guide

## 🎯 Complete Command Line Setup for MySQL and PostgreSQL

This guide uses **ONLY command line** to set up both databases.

---

## Prerequisites

1. MySQL installed
2. PostgreSQL installed
3. Know your MySQL password
4. Know your PostgreSQL password

---

## Part 1: MySQL Setup via Command Line

### Step 1: Navigate to Project Directory

```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
```

### Step 2: Test MySQL Connection

**Option A: If MySQL is in PATH**
```cmd
mysql --version
```

**Option B: Use full path**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" --version
```

If you see version info, MySQL command works! ✅

### Step 3: Create Database

**Option A: Single command (password in command)**
```cmd
mysql -u root -pwasco2024 -e "CREATE DATABASE IF NOT EXISTS wasco_db;"
```

**Option B: Interactive (will prompt for password)**
```cmd
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS wasco_db;"
```

**Option C: Using full path**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pwasco2024 -e "CREATE DATABASE IF NOT EXISTS wasco_db;"
```

### Step 4: Load MySQL Schema

**Option A: Using relative path**
```cmd
mysql -u root -pwasco2024 wasco_db < backend\src\database\mysql_schema.sql
```

**Option B: Using absolute path**
```cmd
mysql -u root -pwasco2024 wasco_db < "C:\Users\hp\Documents\Database Applications\WascoBS\backend\src\database\mysql_schema.sql"
```

**Option C: Using full MySQL path**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pwasco2024 wasco_db < backend\src\database\mysql_schema.sql
```

### Step 5: Verify MySQL Tables

```cmd
mysql -u root -pwasco2024 wasco_db -e "SHOW TABLES;"
```

Expected output:
```
+--------------------+
| Tables_in_wasco_db |
+--------------------+
| billing_rates      |
| bills              |
| customers          |
| districts          |
| payments           |
| users              |
| water_usage        |
+--------------------+
```

✅ **MySQL setup complete!**

---

## Part 2: PostgreSQL Setup via Command Line

### Step 1: Test PostgreSQL Connection

**Option A: If psql is in PATH**
```cmd
psql --version
```

**Option B: Use full path**
```cmd
"C:\Program Files\PostgreSQL\14\bin\psql.exe" --version
```

If you see version info, psql command works! ✅

### Step 2: Set Password Environment Variable (Optional)

This avoids password prompts:
```cmd
set PGPASSWORD=wasco2024
```

### Step 3: Create Database

**Option A: Using environment variable**
```cmd
set PGPASSWORD=wasco2024
psql -U postgres -c "CREATE DATABASE wasco_analytics;"
```

**Option B: Will prompt for password**
```cmd
psql -U postgres -c "CREATE DATABASE wasco_analytics;"
```

**Option C: Using full path**
```cmd
set PGPASSWORD=wasco2024
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -c "CREATE DATABASE wasco_analytics;"
```

### Step 4: Load PostgreSQL Schema

**Option A: Using relative path**
```cmd
set PGPASSWORD=wasco2024
psql -U postgres -d wasco_analytics -f backend\src\database\postgresql_schema.sql
```

**Option B: Using absolute path**
```cmd
set PGPASSWORD=wasco2024
psql -U postgres -d wasco_analytics -f "C:\Users\hp\Documents\Database Applications\WascoBS\backend\src\database\postgresql_schema.sql"
```

**Option C: Using full psql path**
```cmd
set PGPASSWORD=wasco2024
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -d wasco_analytics -f backend\src\database\postgresql_schema.sql
```

### Step 5: Verify PostgreSQL Tables

```cmd
set PGPASSWORD=wasco2024
psql -U postgres -d wasco_analytics -c "\dt"
```

Expected output:
```
              List of relations
 Schema |        Name         | Type  |  Owner
--------+---------------------+-------+----------
 public | analytics_bills     | table | postgres
 public | analytics_customers | table | postgres
 public | analytics_payments  | table | postgres
 public | analytics_usage     | table | postgres
 public | districts           | table | postgres
 public | usage_summary       | table | postgres
```

✅ **PostgreSQL setup complete!**

---

## Part 3: Configure Application

### Step 1: Update .env File

```cmd
notepad backend\.env
```

Update these lines:
```env
MYSQL_PASSWORD=wasco2024
POSTGRES_PASSWORD=wasco2024
```

Save (Ctrl+S) and close.

---

## Part 4: Run the Application

### Terminal 1 - Backend

```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS\backend"
npm install
npm run dev
```

Expected output:
```
✓ MySQL database connection established successfully
✓ PostgreSQL database connection established successfully
🚀 Server running on port 5000
```

### Terminal 2 - Frontend (New CMD window)

```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS\frontend"
npm install
npm start
```

Browser opens to: http://localhost:3000

---

## Complete Script (Copy & Paste All at Once)

### For MySQL:
```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
mysql -u root -pwasco2024 -e "CREATE DATABASE IF NOT EXISTS wasco_db;"
mysql -u root -pwasco2024 wasco_db < backend\src\database\mysql_schema.sql
mysql -u root -pwasco2024 wasco_db -e "SHOW TABLES;"
```

### For PostgreSQL:
```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
set PGPASSWORD=wasco2024
psql -U postgres -c "CREATE DATABASE wasco_analytics;"
psql -U postgres -d wasco_analytics -f backend\src\database\postgresql_schema.sql
psql -U postgres -d wasco_analytics -c "\dt"
```

---

## Troubleshooting

### Error: "mysql is not recognized"

**Solution 1: Add to PATH**
```cmd
set PATH=%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin
```

**Solution 2: Use full path**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pwasco2024 -e "CREATE DATABASE wasco_db;"
```

### Error: "psql is not recognized"

**Solution 1: Add to PATH**
```cmd
set PATH=%PATH%;C:\Program Files\PostgreSQL\14\bin
```

**Solution 2: Use full path**
```cmd
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -c "CREATE DATABASE wasco_analytics;"
```

### Error: "Access denied"

Your password is wrong. Reset it:

**MySQL:**
```cmd
mysql -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'wasco2024';
EXIT;
```

**PostgreSQL:**
```cmd
psql -U postgres
ALTER USER postgres WITH PASSWORD 'wasco2024';
\q
```

### Error: "Cannot find path"

Make sure you're in the correct directory:
```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
dir backend\src\database\mysql_schema.sql
```

If file exists, you're in the right place!

---

## Alternative: One-Line Setup Script

Create `setup-databases.bat`:

```batch
@echo off
echo Setting up WASCO databases...
cd "C:\Users\hp\Documents\Database Applications\WascoBS"

echo Creating MySQL database...
mysql -u root -pwasco2024 -e "CREATE DATABASE IF NOT EXISTS wasco_db;"
mysql -u root -pwasco2024 wasco_db < backend\src\database\mysql_schema.sql

echo Creating PostgreSQL database...
set PGPASSWORD=wasco2024
psql -U postgres -c "CREATE DATABASE wasco_analytics;"
psql -U postgres -d wasco_analytics -f backend\src\database\postgresql_schema.sql

echo Done! Databases created successfully.
pause
```

Run it:
```cmd
setup-databases.bat
```

---

## Verification Commands

### Check MySQL:
```cmd
mysql -u root -pwasco2024 -e "SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema='wasco_db';"
```

Should show: `table_count: 7`

### Check PostgreSQL:
```cmd
set PGPASSWORD=wasco2024
psql -U postgres -d wasco_analytics -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';"
```

Should show: `count: 6` (or more)

---

## Summary

**MySQL Commands:**
```cmd
mysql -u root -pwasco2024 -e "CREATE DATABASE wasco_db;"
mysql -u root -pwasco2024 wasco_db < backend\src\database\mysql_schema.sql
mysql -u root -pwasco2024 wasco_db -e "SHOW TABLES;"
```

**PostgreSQL Commands:**
```cmd
set PGPASSWORD=wasco2024
psql -U postgres -c "CREATE DATABASE wasco_analytics;"
psql -U postgres -d wasco_analytics -f backend\src\database\postgresql_schema.sql
psql -U postgres -d wasco_analytics -c "\dt"
```

**Run Application:**
```cmd
cd backend
npm run dev

# New terminal
cd frontend
npm start
```

✅ **All done via command line!** 🚀