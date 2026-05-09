# Fix "mysql is not recognized" Error - Windows

This error means MySQL command-line tools are not in your system PATH. Here's how to fix it:

## Solution 1: Add MySQL to System PATH (Recommended)

### Step 1: Find MySQL Installation Directory

MySQL is usually installed in one of these locations:
- `C:\Program Files\MySQL\MySQL Server 8.0\bin`
- `C:\Program Files\MySQL\MySQL Server 5.7\bin`
- `C:\MySQL\bin`
- `C:\xampp\mysql\bin` (if using XAMPP)
- `C:\wamp64\bin\mysql\mysql8.0.x\bin` (if using WAMP)

### Step 2: Verify MySQL Directory Exists

Open File Explorer and navigate to the directory. You should see files like:
- `mysql.exe`
- `mysqld.exe`
- `mysqldump.exe`

### Step 3: Add to System PATH

**Method A: Using System Properties (GUI)**

1. Press `Windows + R`, type `sysdm.cpl`, press Enter
2. Click "Advanced" tab
3. Click "Environment Variables" button
4. Under "System variables", find and select "Path"
5. Click "Edit"
6. Click "New"
7. Paste your MySQL bin path (e.g., `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
8. Click "OK" on all windows
9. **IMPORTANT**: Close and reopen CMD for changes to take effect

**Method B: Using CMD (Quick)**

Open CMD as Administrator and run:
```cmd
setx PATH "%PATH%;C:\Program Files\MySQL\MySQL Server 8.0\bin" /M
```
(Replace with your actual MySQL path)

### Step 4: Verify It Works

Close all CMD windows, open a new CMD, and run:
```cmd
mysql --version
```

You should see something like:
```
mysql  Ver 8.0.x for Win64 on x86_64
```

## Solution 2: Use Full Path (Quick Fix)

If you don't want to modify PATH, use the full path to mysql.exe:

```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

## Solution 3: Use MySQL Workbench (GUI Alternative)

If you have MySQL Workbench installed:

1. Open MySQL Workbench
2. Click on your local connection
3. Enter your password
4. You can run SQL commands in the query window

### Create Database in Workbench:
```sql
CREATE DATABASE wasco_db;
```

### Load Schema in Workbench:
1. Click "File" → "Open SQL Script"
2. Navigate to: `C:\Users\hp\Documents\Database Applications\WascoBS\backend\src\database\mysql_schema.sql`
3. Click "Execute" (lightning bolt icon)

## Solution 4: Use XAMPP/WAMP Control Panel

If you're using XAMPP or WAMP:

### XAMPP:
1. Open XAMPP Control Panel
2. Start MySQL
3. Click "Shell" button
4. Now you can use `mysql` command

### WAMP:
1. Open WAMP
2. Left-click WAMP icon in system tray
3. MySQL → MySQL Console
4. Enter password when prompted

## How to Find Your MySQL Installation

### Method 1: Check Services
1. Press `Windows + R`, type `services.msc`, press Enter
2. Look for "MySQL" or "MySQL80" service
3. Right-click → Properties
4. Look at "Path to executable" - this shows where MySQL is installed

### Method 2: Check Program Files
Open File Explorer and check:
```
C:\Program Files\MySQL\
C:\Program Files (x86)\MySQL\
```

### Method 3: Check Registry
1. Press `Windows + R`, type `regedit`, press Enter
2. Navigate to: `HKEY_LOCAL_MACHINE\SOFTWARE\MySQL AB`
3. Look for installation path

## Alternative: Use Node.js to Create Database

Since you have Node.js installed, you can create the database using a script:

### Step 1: Create setup script

Create file `backend/setup-database.js`:
```javascript
require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
  try {
    // Connect without database
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD
    });

    console.log('✅ Connected to MySQL');

    // Create database
    await connection.query('CREATE DATABASE IF NOT EXISTS wasco_db');
    console.log('✅ Database wasco_db created');

    // Use database
    await connection.query('USE wasco_db');

    // Read and execute schema
    const fs = require('fs');
    const schema = fs.readFileSync('./src/database/mysql_schema.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
      }
    }

    console.log('✅ Schema loaded successfully');
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupDatabase();
```

### Step 2: Update backend/.env

Make sure your MySQL password is correct in `backend/.env`:
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_actual_password_here
```

### Step 3: Run setup script

```cmd
cd backend
npm install
node setup-database.js
```

This will create the database and load the schema without needing the mysql command!

## For PostgreSQL

Same issue? Here's how to fix:

### Add PostgreSQL to PATH:

1. Find PostgreSQL bin directory (usually `C:\Program Files\PostgreSQL\14\bin`)
2. Add to PATH using same steps as MySQL
3. Or use full path: `"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres`

### Or use pgAdmin (GUI):

1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click "Databases" → Create → Database
4. Name it `wasco_analytics`
5. Right-click database → Query Tool
6. Open and execute `backend\src\database\postgresql_schema.sql`

## Quick Summary

**If you can't fix PATH:**
1. Use MySQL Workbench or phpMyAdmin (GUI tools)
2. Use the Node.js setup script (recommended)
3. Use full path to mysql.exe

**If you want to fix PATH:**
1. Find MySQL bin directory
2. Add to System PATH
3. Restart CMD
4. Test with `mysql --version`

## Still Having Issues?

Try this simple test to see if MySQL is installed:

```cmd
dir "C:\Program Files\MySQL" /s /b | findstr mysql.exe
```

This will show you where mysql.exe is located. Then use that path!

## Next Steps After Fixing

Once MySQL command works:

1. **Create Database:**
```cmd
mysql -u root -p
CREATE DATABASE wasco_db;
EXIT;
```

2. **Load Schema:**
```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
mysql -u root -p wasco_db < backend\src\database\mysql_schema.sql
```

3. **Verify:**
```cmd
mysql -u root -p wasco_db
SHOW TABLES;
EXIT;
```

You should see 7+ tables listed!