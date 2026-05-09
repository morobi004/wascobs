# WASCO Water Bill Management System - Getting Started Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)

### Optional but Recommended
- **MySQL Workbench** - For database management
- **pgAdmin** - For PostgreSQL management
- **Postman** - For API testing
- **VS Code** - Recommended code editor

---

## 🚀 Quick Start (5 Steps)

### Step 1: Install Dependencies

```powershell
# Backend dependencies
cd backend
npm install

# Frontend dependencies (when ready)
cd ../frontend
npm install
```

### Step 2: Set Up Databases

#### MySQL Setup
```powershell
# Start MySQL service (if not running)
# Windows: Services -> MySQL -> Start
# Or use MySQL Workbench

# Create database and run schema
mysql -u root -p < backend/src/database/mysql_schema.sql
```

#### PostgreSQL Setup
```powershell
# Start PostgreSQL service (if not running)
# Windows: Services -> PostgreSQL -> Start
# Or use pgAdmin

# Create database and run schema
psql -U postgres -f backend/src/database/postgresql_schema.sql
```

### Step 3: Configure Environment

```powershell
# Copy example environment file
cd backend
copy .env.example .env

# Edit .env file with your database credentials
# Use notepad, VS Code, or any text editor
notepad .env
```

**Important:** Update these values in `.env`:
- `MYSQL_PASSWORD` - Your MySQL root password
- `POSTGRES_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate a random secret key
- `STRIPE_SECRET_KEY` - Your Stripe API key (get from stripe.com)

### Step 4: Test Database Connections

```powershell
# From backend directory
node -e "const {testConnections} = require('./src/config/database'); testConnections();"
```

You should see:
```
✓ MySQL Primary Database connected successfully
✓ PostgreSQL Analytics Database connected successfully
```

### Step 5: Start Development Server

```powershell
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory - when ready)
npm start
```

---

## 📁 Project Structure Overview

```
WascoBS/
├── backend/                    # Node.js + Express.js Backend
│   ├── src/
│   │   ├── config/            # Database & service configurations
│   │   ├── models/            # Sequelize models
│   │   │   ├── mysql/         # MySQL models
│   │   │   └── postgresql/    # PostgreSQL models
│   │   ├── controllers/       # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, validation, etc.
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Helper functions
│   │   └── database/          # SQL schemas & migrations
│   ├── tests/                 # Unit & integration tests
│   ├── .env                   # Environment variables (create from .env.example)
│   └── package.json
│
├── frontend/                   # React.js Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── redux/             # State management
│   │   ├── services/          # API services
│   │   └── utils/             # Utilities
│   └── package.json
│
└── docs/                       # Documentation
    ├── TECHNICAL_SPECIFICATION.md
    ├── DATABASE_DESIGN.md
    ├── IMPLEMENTATION_ROADMAP.md
    └── RUBRIC_ALIGNMENT.md
```

---

## 🗄️ Database Setup Details

### MySQL Primary Database

**Purpose:** Operational data (customers, bills, payments, usage)

**Tables Created:**
1. users - Authentication and user management
2. districts - All 10 Lesotho districts
3. customers - Customer accounts
4. billing_rates - Tiered pricing
5. water_usage - Meter readings
6. bills - Generated bills
7. payments - Payment transactions
8. notifications - System notifications
9. leakage_reports - Water leakage tracking
10. audit_log - System activity logs

**Views Created:**
- customer_billing_summary
- outstanding_balances
- monthly_usage_patterns
- payment_history_summary

**Stored Procedures:**
- calculate_bill_amount()

**Triggers:**
- after_payment_insert

### PostgreSQL Analytics Database

**Purpose:** Historical data warehouse and analytics

**Tables Created:**
1. customer_analytics - Customer-level aggregations
2. usage_analytics - Time-series consumption data
3. district_analytics - District performance metrics
4. revenue_analytics - OLAP cube for revenue
5. payment_trends - Payment method analysis
6. consumption_patterns - Usage categorization

**Materialized Views:**
- monthly_summary
- district_performance

**Functions:**
- calculate_collection_rate()
- get_top_consumers()
- get_district_summary()
- get_usage_trend()
- get_payment_method_distribution()
- get_consumption_category_distribution()

---

## 🔧 Configuration Guide

### Environment Variables Explained

```env
# Server Configuration
NODE_ENV=development          # development | production
PORT=5000                     # Backend server port

# MySQL Configuration
MYSQL_HOST=localhost          # MySQL server host
MYSQL_PORT=3306              # MySQL port
MYSQL_DATABASE=wasco_primary # Database name
MYSQL_USER=root              # MySQL username
MYSQL_PASSWORD=your_password # YOUR MySQL password

# PostgreSQL Configuration
POSTGRES_HOST=localhost           # PostgreSQL server host
POSTGRES_PORT=5432               # PostgreSQL port
POSTGRES_DATABASE=wasco_analytics # Database name
POSTGRES_USER=postgres           # PostgreSQL username
POSTGRES_PASSWORD=your_password  # YOUR PostgreSQL password

# JWT Configuration
JWT_SECRET=your_secret_key_here  # Generate random string
JWT_EXPIRE=7d                    # Token expiry (7 days)

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...    # Get from stripe.com
STRIPE_PUBLISHABLE_KEY=pk_test_... # Get from stripe.com

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password  # Gmail app password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Generating Secure Keys

```powershell
# Generate JWT secret (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## 🧪 Testing Database Setup

### Test MySQL Connection

```sql
-- Connect to MySQL
mysql -u root -p

-- Verify database
USE wasco_primary;
SHOW TABLES;

-- Check districts data
SELECT * FROM districts;

-- Should show 10 Lesotho districts
```

### Test PostgreSQL Connection

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Verify database
\c wasco_analytics
\dt

-- List tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 📊 Initial Data

### Lesotho Districts (Pre-loaded)

The MySQL schema automatically loads all 10 districts:

1. **Maseru** (MAS) - Capital, Lowlands
2. **Berea** (BER) - Lowlands
3. **Leribe** (LER) - Lowlands
4. **Mafeteng** (MAF) - Lowlands
5. **Mohale's Hoek** (MOH) - Lowlands
6. **Quthing** (QUT) - Lowlands
7. **Qacha's Nek** (QAC) - Mountains
8. **Mokhotlong** (MOK) - Mountains
9. **Thaba-Tseka** (THA) - Mountains
10. **Butha-Buthe** (BUT) - Lowlands

---

## 🔐 Security Setup

### Database User Permissions

For production, create separate database users with limited permissions:

```sql
-- MySQL: Create application user
CREATE USER 'wasco_app'@'localhost' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON wasco_primary.* TO 'wasco_app'@'localhost';
FLUSH PRIVILEGES;

-- PostgreSQL: Create application user
CREATE USER wasco_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE wasco_analytics TO wasco_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO wasco_app;
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Problem:** Cannot connect to MySQL or PostgreSQL

**Solutions:**
- Verify database service is running
- Check credentials in `.env` file
- Ensure database exists (run schema files)
- Check firewall settings
- Verify port numbers (MySQL: 3306, PostgreSQL: 5432)

#### 2. npm install fails

**Problem:** Dependencies installation errors

**Solutions:**
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

#### 3. Port Already in Use

**Problem:** Port 5000 or 3000 already in use

**Solutions:**
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

#### 4. MySQL Schema Import Fails

**Problem:** Error importing mysql_schema.sql

**Solutions:**
```powershell
# Import with error logging
mysql -u root -p wasco_primary < backend/src/database/mysql_schema.sql 2> errors.log

# Check errors.log for specific issues
```

#### 5. PostgreSQL Permission Denied

**Problem:** Cannot create database or tables

**Solutions:**
```powershell
# Run as postgres superuser
psql -U postgres

# Or grant permissions
ALTER USER your_user WITH SUPERUSER;
```

---

## 📝 Next Steps

After successful setup:

1. **Create Admin User**
   - Use API endpoint or direct database insert
   - Hash password with bcrypt

2. **Add Billing Rates**
   - Configure tiered pricing for residential, commercial, industrial

3. **Add Sample Customers**
   - For testing purposes

4. **Test API Endpoints**
   - Use Postman or similar tool
   - Test authentication, CRUD operations

5. **Set Up Frontend**
   - Configure API base URL
   - Test user interfaces

---

## 🔗 Useful Commands

### Backend Development

```powershell
# Start development server with auto-reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run database migrations
npm run migrate

# Seed database with sample data
npm run seed
```

### Database Management

```powershell
# Backup MySQL database
mysqldump -u root -p wasco_primary > backup_mysql.sql

# Backup PostgreSQL database
pg_dump -U postgres wasco_analytics > backup_postgres.sql

# Restore MySQL database
mysql -u root -p wasco_primary < backup_mysql.sql

# Restore PostgreSQL database
psql -U postgres wasco_analytics < backup_postgres.sql
```

---

## 📚 Additional Resources

### Documentation
- [Technical Specification](TECHNICAL_SPECIFICATION.md)
- [Database Design](DATABASE_DESIGN.md)
- [Implementation Roadmap](IMPLEMENTATION_ROADMAP.md)
- [Rubric Alignment](RUBRIC_ALIGNMENT.md)

### External Resources
- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Stripe API Documentation](https://stripe.com/docs/api)

---

## 💡 Tips for Success

1. **Start Small:** Get basic CRUD operations working first
2. **Test Often:** Test each feature as you build it
3. **Use Version Control:** Commit changes regularly
4. **Read Error Messages:** They usually tell you what's wrong
5. **Ask for Help:** Use documentation and community resources
6. **Keep Learning:** Database applications are complex but rewarding

---

## 🎯 Development Checklist

- [ ] Node.js and npm installed
- [ ] MySQL installed and running
- [ ] PostgreSQL installed and running
- [ ] Backend dependencies installed
- [ ] MySQL schema imported successfully
- [ ] PostgreSQL schema imported successfully
- [ ] Environment variables configured
- [ ] Database connections tested
- [ ] Development server starts without errors
- [ ] Can access API endpoints
- [ ] Frontend dependencies installed (when ready)
- [ ] Frontend connects to backend API

---

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Check the documentation files
4. Verify all prerequisites are met
5. Ensure all configuration is correct

---

## ✅ Verification

Your setup is complete when:

✓ Both databases are created and populated  
✓ Backend server starts without errors  
✓ Database connections are successful  
✓ API endpoints are accessible  
✓ No error messages in console  

**Congratulations! You're ready to start development!** 🎉

---

*Last Updated: May 2026*