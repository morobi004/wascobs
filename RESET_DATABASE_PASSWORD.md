# How to Set/Reset MySQL and PostgreSQL Passwords Using CMD

## MySQL Password Reset (Windows CMD)

### Method 1: Using MySQL Command (If you know current password)

1. **Find MySQL bin directory:**
```cmd
dir "C:\Program Files\MySQL" /s /b | findstr mysql.exe
```

2. **Use full path to connect:**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

3. **Enter current password, then change it:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword123';
FLUSH PRIVILEGES;
EXIT;
```

### Method 2: Reset MySQL Password (If you forgot password)

**Step 1: Stop MySQL Service**
```cmd
net stop MySQL80
```
(Service name might be MySQL, MySQL57, MySQL80, etc.)

**Step 2: Create a password reset file**
```cmd
echo ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword123'; > C:\mysql-init.txt
```

**Step 3: Start MySQL with init file**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --init-file=C:\mysql-init.txt --console
```

**Step 4: Open new CMD window and stop MySQL**
```cmd
taskkill /F /IM mysqld.exe
```

**Step 5: Start MySQL normally**
```cmd
net start MySQL80
```

**Step 6: Test new password**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```
Enter: `NewPassword123`

**Step 7: Delete the init file**
```cmd
del C:\mysql-init.txt
```

### Method 3: Using MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Click "Server" → "Users and Privileges"
3. Select "root" user
4. Click "Change Password"
5. Enter new password
6. Click "Apply"

## PostgreSQL Password Reset (Windows CMD)

### Method 1: Using psql Command (If you know current password)

1. **Find PostgreSQL bin directory:**
```cmd
dir "C:\Program Files\PostgreSQL" /s /b | findstr psql.exe
```

2. **Use full path to connect:**
```cmd
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

3. **Enter current password, then change it:**
```sql
ALTER USER postgres WITH PASSWORD 'NewPassword123';
\q
```

### Method 2: Reset PostgreSQL Password (If you forgot password)

**Step 1: Find pg_hba.conf file**

Usually located at:
```
C:\Program Files\PostgreSQL\14\data\pg_hba.conf
```

**Step 2: Backup the file**
```cmd
copy "C:\Program Files\PostgreSQL\14\data\pg_hba.conf" "C:\Program Files\PostgreSQL\14\data\pg_hba.conf.backup"
```

**Step 3: Edit pg_hba.conf**

Open as Administrator:
```cmd
notepad "C:\Program Files\PostgreSQL\14\data\pg_hba.conf"
```

Find these lines:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            scram-sha-256
```

Change `scram-sha-256` to `trust`:
```
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
```

Save and close.

**Step 4: Restart PostgreSQL**
```cmd
net stop postgresql-x64-14
net start postgresql-x64-14
```

**Step 5: Connect without password**
```cmd
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

**Step 6: Set new password**
```sql
ALTER USER postgres WITH PASSWORD 'NewPassword123';
\q
```

**Step 7: Restore pg_hba.conf**
```cmd
copy "C:\Program Files\PostgreSQL\14\data\pg_hba.conf.backup" "C:\Program Files\PostgreSQL\14\data\pg_hba.conf"
```

**Step 8: Restart PostgreSQL again**
```cmd
net stop postgresql-x64-14
net start postgresql-x64-14
```

**Step 9: Test new password**
```cmd
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```
Enter: `NewPassword123`

### Method 3: Using pgAdmin (GUI)

1. Open pgAdmin
2. Right-click on "PostgreSQL 14" server
3. Click "Properties"
4. Go to "Connection" tab
5. Enter new password
6. Click "Save"

## Recommended Simple Passwords for Development

For your WASCO project (development only):

**MySQL:**
```
Username: root
Password: wasco2024
```

**PostgreSQL:**
```
Username: postgres
Password: wasco2024
```

## After Setting Passwords

### Update backend/.env file

1. **Open the file:**
```cmd
cd "C:\Users\hp\Documents\Database Applications\WascoBS"
notepad backend\.env
```

2. **Update these lines:**
```env
MYSQL_PASSWORD=wasco2024
POSTGRES_PASSWORD=wasco2024
```

3. **Save and close** (Ctrl+S, then close)

### Verify Passwords Work

**Test MySQL:**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pwasco2024
```

If successful, you'll see `mysql>` prompt. Type `EXIT;` to quit.

**Test PostgreSQL:**
```cmd
set PGPASSWORD=wasco2024
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
```

If successful, you'll see `postgres=#` prompt. Type `\q` to quit.

## Quick Setup Script

Create a file `set-passwords.bat`:

```batch
@echo off
echo Setting MySQL password...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'wasco2024'; FLUSH PRIVILEGES;"

echo Setting PostgreSQL password...
set PGPASSWORD=postgres
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres -c "ALTER USER postgres WITH PASSWORD 'wasco2024';"

echo Done! Passwords set to: wasco2024
pause
```

Run it as Administrator:
```cmd
set-passwords.bat
```

## Troubleshooting

### "Access Denied" after password change

1. Make sure you're using the new password
2. Try connecting with full path
3. Restart the database service

### "Cannot connect to server"

1. Check if service is running:
```cmd
net start | findstr MySQL
net start | findstr postgres
```

2. Start if not running:
```cmd
net start MySQL80
net start postgresql-x64-14
```

### "Command not found"

Use full paths to executables:
- MySQL: `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"`
- PostgreSQL: `"C:\Program Files\PostgreSQL\14\bin\psql.exe"`

## Security Note

⚠️ **IMPORTANT**: The password `wasco2024` is only for development!

For production, use strong passwords:
- At least 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Example: `W@sc0_Pr0d_2024!#`

## Next Steps After Setting Passwords

1. ✅ Passwords set for both databases
2. ✅ backend/.env file updated
3. ⏭️ Create databases (see START_APP.md)
4. ⏭️ Load schemas (see START_APP.md)
5. ⏭️ Start the application

## Summary Commands

**Set MySQL password to wasco2024:**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY 'wasco2024';
FLUSH PRIVILEGES;
EXIT;
```

**Set PostgreSQL password to wasco2024:**
```cmd
"C:\Program Files\PostgreSQL\14\bin\psql.exe" -U postgres
ALTER USER postgres WITH PASSWORD 'wasco2024';
\q
```

**Update .env:**
```cmd
notepad backend\.env
```
Change to:
```
MYSQL_PASSWORD=wasco2024
POSTGRES_PASSWORD=wasco2024
```

Done! 🎉