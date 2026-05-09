# Database Verification Guide - Windows CMD

This guide shows you how to verify your MySQL and PostgreSQL credentials and test database connections using Windows Command Prompt (CMD).

## Part 1: Verify MySQL Connection

### Step 1: Check if MySQL is Running

Open CMD as Administrator and run:
```cmd
net start | findstr MySQL
```

If MySQL is not running, start it:
```cmd
net start MySQL80
```
(Note: The service name might be different like `MySQL`, `MySQL57`, etc.)

### Step 2: Test MySQL Connection

Try to connect to MySQL:
```cmd
mysql -u root -p
```

When prompted, enter your MySQL password. If successful, you'll see:
```
Welcome to the MySQL monitor...
mysql>
```

### Step 3: Verify MySQL Password Works

Once connected, try these commands:
```sql
SHOW DATABASES;
SELECT USER();
EXIT;
```

If all commands work, your MySQL password is correct!

### Step 4: Find Your MySQL Password (If Forgotten)

If you forgot your password, you can reset it:

1. Stop MySQL service:
```cmd
net stop MySQL80
```

2. Start MySQL without password:
```cmd
mysqld --skip-grant-tables
```

3. In a new CMD window:
```cmd
mysql -u root
```

4. Reset password:
```sql
USE mysql;
UPDATE user SET authentication_string=PASSWORD('your_new_password') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;
```

5. Restart MySQL normally:
```cmd
net start MySQL80
```

## Part 2: Verify PostgreSQL Connection

### Step 1: Check if PostgreSQL is Running

Open CMD as Administrator and run:
```cmd
net start | findstr postgres
```

If PostgreSQL is not running, start it:
```cmd
net start postgresql-x64-14
```
(Note: Version number might be different like `postgresql-x64-15`, etc.)

### Step 2: Test PostgreSQL Connection

Try to connect to PostgreSQL:
```cmd
psql -U postgres
```

When prompted, enter your PostgreSQL password. If successful, you'll see:
```
postgres=#
```

### Step 3: Verify PostgreSQL Password Works

Once connected, try these commands:
```sql
\l
\du
\q
```

If all commands work, your PostgreSQL password is correct!

### Step 4: Find Your PostgreSQL Password (If Forgotten)

If you forgot your password:

1. Find the `pg_hba.conf` file (usually in `C:\Program Files\PostgreSQL\14\data\`)

2. Open it with Notepad as Administrator

3. Find this line:
```
host    all             all             127.0.0.1/32            md5
```

4. Change `md5` to `trust`:
```
host    all             all             127.0.0.1/32            trust
```

5. Restart PostgreSQL:
```cmd
net stop postgresql-x64-14
net start postgresql-x64-14
```

6. Connect without password:
```cmd
psql -U postgres
```

7. Reset password:
```sql
ALTER USER postgres WITH PASSWORD 'your_new_password';
\q
```

8. Change `pg_hba.conf` back to `md5` and restart PostgreSQL

## Part 3: Update backend/.env File

### Step 1: Navigate to Your Project

```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
```

### Step 2: Open .env File

```cmd
notepad backend\.env
```

### Step 3: Update Credentials

Update these lines with your actual passwords:
```env
MYSQL_PASSWORD=your_actual_mysql_password_here
POSTGRES_PASSWORD=your_actual_postgres_password_here
```

For example:
```env
MYSQL_PASSWORD=MySecurePass123
POSTGRES_PASSWORD=PostgresPass456
```

### Step 4: Save and Close

Press `Ctrl+S` to save, then close Notepad.

## Part 4: Test Database Connection from Node.js

### Step 1: Create Test Script

Create a file `backend/test-db.js`:
```cmd
notepad backend\test-db.js
```

Paste this code:
```javascript
require('dotenv').config();
const mysql = require('mysql2/promise');
const { Client } = require('pg');

async function testMySQL() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: 'mysql'
    });
    console.log('✅ MySQL connection successful!');
    await connection.end();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
  }
}

async function testPostgreSQL() {
  try {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: 'postgres'
    });
    await client.connect();
    console.log('✅ PostgreSQL connection successful!');
    await client.end();
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
  }
}

async function test() {
  console.log('Testing database connections...\n');
  await testMySQL();
  await testPostgreSQL();
}

test();
```

Save and close.

### Step 2: Run Test Script

```cmd
cd backend
node test-db.js
```

### Expected Output:
```
Testing database connections...

✅ MySQL connection successful!
✅ PostgreSQL connection successful!
```

If you see both checkmarks, your credentials are correct!

## Part 5: Create Databases

### Create MySQL Database

```cmd
mysql -u root -p
```

Enter password, then:
```sql
CREATE DATABASE wasco_db;
SHOW DATABASES;
EXIT;
```

### Create PostgreSQL Database

```cmd
psql -U postgres
```

Enter password, then:
```sql
CREATE DATABASE wasco_analytics;
\l
\q
```

## Part 6: Load Database Schemas

### Load MySQL Schema

```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
mysql -u root -p wasco_db < backend\src\database\mysql_schema.sql
```

Enter your MySQL password when prompted.

### Load PostgreSQL Schema

```cmd
psql -U postgres -d wasco_analytics -f backend\src\database\postgresql_schema.sql
```

Enter your PostgreSQL password when prompted.

## Part 7: Verify Schemas Loaded

### Verify MySQL Tables

```cmd
mysql -u root -p wasco_db
```

Then:
```sql
SHOW TABLES;
```

You should see:
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

### Verify PostgreSQL Tables

```cmd
psql -U postgres -d wasco_analytics
```

Then:
```sql
\dt
```

You should see tables like:
```
 analytics_bills
 analytics_customers
 analytics_payments
 analytics_usage
 districts
 usage_summary
```

## Troubleshooting

### "Access Denied" Error

This means your password is wrong. Follow the password reset steps above.

### "Can't Connect to MySQL Server"

1. Check if MySQL is running:
```cmd
net start MySQL80
```

2. Check if port 3306 is open:
```cmd
netstat -an | findstr 3306
```

### "Could Not Connect to Server" (PostgreSQL)

1. Check if PostgreSQL is running:
```cmd
net stop postgresql-x64-14
net start postgresql-x64-14
```

2. Check if port 5432 is open:
```cmd
netstat -an | findstr 5432
```

### "Command Not Found" (mysql or psql)

Add to PATH:

**For MySQL:**
1. Open System Properties → Environment Variables
2. Edit PATH variable
3. Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

**For PostgreSQL:**
1. Open System Properties → Environment Variables
2. Edit PATH variable
3. Add: `C:\Program Files\PostgreSQL\14\bin`

4. Restart CMD

## Quick Reference Commands

### MySQL
```cmd
# Start MySQL
net start MySQL80

# Stop MySQL
net stop MySQL80

# Connect
mysql -u root -p

# Connect to specific database
mysql -u root -p wasco_db

# Run SQL file
mysql -u root -p wasco_db < schema.sql
```

### PostgreSQL
```cmd
# Start PostgreSQL
net start postgresql-x64-14

# Stop PostgreSQL
net stop postgresql-x64-14

# Connect
psql -U postgres

# Connect to specific database
psql -U postgres -d wasco_analytics

# Run SQL file
psql -U postgres -d wasco_analytics -f schema.sql
```

## Summary Checklist

- [ ] MySQL is running
- [ ] PostgreSQL is running
- [ ] MySQL password verified
- [ ] PostgreSQL password verified
- [ ] backend/.env file updated
- [ ] Test script runs successfully
- [ ] wasco_db database created
- [ ] wasco_analytics database created
- [ ] MySQL schema loaded
- [ ] PostgreSQL schema loaded
- [ ] Tables verified in both databases

Once all items are checked, you're ready to run the application!