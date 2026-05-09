# Quick Start Guide - WASCO Water Bill Management System

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js installed (run: `node --version`)
- ✅ MySQL installed and running
- ✅ PostgreSQL installed and running

## Quick Start (5 Steps)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Database Credentials

Edit `backend/.env` file and update:
```env
MYSQL_PASSWORD=your_actual_mysql_password
POSTGRES_PASSWORD=your_actual_postgres_password
```

### Step 3: Create Databases

**MySQL:**
```bash
mysql -u root -p
```
Then run:
```sql
CREATE DATABASE wasco_db;
EXIT;
```

**PostgreSQL:**
```bash
psql -U postgres
```
Then run:
```sql
CREATE DATABASE wasco_analytics;
\q
```

### Step 4: Run Database Schemas

**MySQL Schema:**
```bash
mysql -u root -p wasco_db < backend/src/database/mysql_schema.sql
```

**PostgreSQL Schema:**
```bash
psql -U postgres -d wasco_analytics -f backend/src/database/postgresql_schema.sql
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm start
```

## Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Test the API

### Check if backend is running:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-...",
  "uptime": 123.456
}
```

### Create an admin user:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@wasco.ls\",\"password\":\"Admin@123\",\"full_name\":\"System Admin\",\"phone_number\":\"+26612345678\",\"role\":\"administrator\"}"
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@wasco.ls\",\"password\":\"Admin@123\"}"
```

## Troubleshooting

### "Cannot connect to MySQL"
1. Check if MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Linux/Mac
   sudo systemctl start mysql
   ```

2. Verify credentials in `backend/.env`

### "Cannot connect to PostgreSQL"
1. Check if PostgreSQL is running:
   ```bash
   # Windows
   net start postgresql-x64-14
   
   # Linux/Mac
   sudo systemctl start postgresql
   ```

2. Verify credentials in `backend/.env`

### "Port 5000 already in use"
Change the port in `backend/.env`:
```env
PORT=5001
```

Then update `frontend/package.json`:
```json
"proxy": "http://localhost:5001"
```

### "Module not found"
Delete node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## What's Working

✅ **Backend API (Complete):**
- Authentication (register, login, JWT tokens)
- Customer management (CRUD operations)
- Billing management (rate tiers, bill generation)
- Payment processing (Stripe integration)
- Water usage tracking
- Admin dashboard (user/customer/rate management)
- Manager analytics (OLAP queries: daily/weekly/monthly/quarterly/yearly)
- All 10 Lesotho districts supported

✅ **Database (Complete):**
- MySQL operational database (10 tables)
- PostgreSQL analytics database (6 tables)
- Views, stored procedures, triggers
- Distributed architecture

✅ **Frontend (Basic Setup):**
- React app structure
- Routing configured
- API client with token refresh
- Authentication context
- Basic UI components

## API Endpoints Available

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- POST `/api/auth/refresh-token` - Refresh access token
- GET `/api/auth/profile` - Get user profile

### Customers
- GET `/api/customers` - List all customers
- GET `/api/customers/:id` - Get customer by ID
- GET `/api/customers/account/:accountNumber` - Get by account number
- POST `/api/customers` - Create customer
- PUT `/api/customers/:id` - Update customer
- DELETE `/api/customers/:id` - Delete customer
- GET `/api/customers/:accountNumber/bills` - Get customer bills
- GET `/api/customers/:accountNumber/payments` - Get payment history
- GET `/api/customers/:accountNumber/usage-history` - Get usage history

### Billing
- GET `/api/billing` - List all bills
- GET `/api/billing/:id` - Get bill by ID
- POST `/api/billing/generate` - Generate single bill
- POST `/api/billing/generate-bulk` - Generate bulk bills
- GET `/api/billing/outstanding/:account_number` - Get outstanding bills
- GET `/api/billing/summary/stats` - Get billing summary
- GET `/api/billing/rates/all` - Get all billing rates
- POST `/api/billing/rates` - Create billing rate
- PUT `/api/billing/rates/:id` - Update billing rate

### Payments
- GET `/api/payments` - List all payments
- GET `/api/payments/:id` - Get payment by ID
- POST `/api/payments/create-intent` - Create Stripe payment intent
- POST `/api/payments/confirm` - Confirm payment
- POST `/api/payments/manual` - Record manual payment
- GET `/api/payments/history/:account_number` - Get payment history
- GET `/api/payments/summary/stats` - Get payment summary

### Admin (Administrator only)
- GET `/api/admin/dashboard/stats` - Dashboard statistics
- GET `/api/admin/users` - List users
- POST `/api/admin/users` - Create user
- GET `/api/admin/customers` - List customers
- POST `/api/admin/customers` - Create customer
- GET `/api/admin/billing-rates` - List billing rates
- GET `/api/admin/reports/revenue` - Revenue report
- GET `/api/admin/reports/consumption` - Consumption report
- GET `/api/admin/reports/districts` - District report

### Manager (Branch Manager only)
- GET `/api/manager/analytics/daily` - Daily analytics
- GET `/api/manager/analytics/weekly` - Weekly analytics
- GET `/api/manager/analytics/monthly` - Monthly analytics
- GET `/api/manager/analytics/quarterly` - Quarterly analytics
- GET `/api/manager/analytics/yearly` - Yearly analytics
- GET `/api/manager/analytics/usage` - Usage analytics
- GET `/api/manager/analytics/top-consumers` - Top consumers
- GET `/api/manager/analytics/customer-segmentation` - Customer segments
- GET `/api/manager/analytics/payment-trends` - Payment trends
- GET `/api/manager/analytics/outstanding` - Outstanding analysis
- GET `/api/manager/analytics/revenue-forecast` - Revenue forecast
- GET `/api/manager/analytics/district-comparison` - District comparison

### Water Usage
- GET `/api/usage` - List all usage records
- GET `/api/usage/:id` - Get usage by ID
- GET `/api/usage/account/:accountNumber` - Get usage by account
- POST `/api/usage` - Create usage record
- PUT `/api/usage/:id` - Update usage record

## Next Steps

1. ✅ Backend is fully functional - test all endpoints
2. ⏳ Build React components for the frontend UI
3. ⏳ Add data visualization charts
4. ⏳ Implement bill notification system
5. ⏳ Add water leakage reporting feature

## Support

For detailed documentation, see:
- `SETUP_INSTRUCTIONS.md` - Full setup guide
- `TECHNICAL_SPECIFICATION.md` - Technical details
- `DATABASE_DESIGN.md` - Database schema
- `README.md` - Project overview