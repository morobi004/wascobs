# WASCO Water Bill Management System - Setup Instructions

## Prerequisites

Before running the application, ensure you have the following installed:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
3. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
4. **npm** or **yarn** package manager

## Step 1: Database Setup

### MySQL Setup

1. Start MySQL server
2. Create the database:
```sql
CREATE DATABASE wasco_db;
```

3. Run the MySQL schema:
```bash
mysql -u root -p wasco_db < backend/src/database/mysql_schema.sql
```

### PostgreSQL Setup

1. Start PostgreSQL server
2. Create the database:
```sql
CREATE DATABASE wasco_analytics;
```

3. Run the PostgreSQL schema:
```bash
psql -U postgres -d wasco_analytics -f backend/src/database/postgresql_schema.sql
```

## Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Open `backend/.env` file
   - Update the following values:
     - `MYSQL_PASSWORD`: Your MySQL root password
     - `POSTGRES_PASSWORD`: Your PostgreSQL password
     - `JWT_SECRET`: Generate a secure random string
     - `JWT_REFRESH_SECRET`: Generate another secure random string
     - `STRIPE_SECRET_KEY`: Your Stripe secret key (optional for testing)

4. Start the backend server:
```bash
npm run dev
```

The backend API will be available at: `http://localhost:5000`

## Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will be available at: `http://localhost:3000`

## Step 4: Verify Installation

1. Check backend health:
   - Open browser: `http://localhost:5000/health`
   - You should see: `{"status":"OK","timestamp":"...","uptime":...}`

2. Check API endpoints:
   - Open browser: `http://localhost:5000`
   - You should see the API documentation

3. Check frontend:
   - Open browser: `http://localhost:3000`
   - You should see the WASCO homepage

## Step 5: Create Initial Admin User

You can create an admin user using the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@wasco.ls",
    "password": "Admin@123",
    "full_name": "System Administrator",
    "phone_number": "+26612345678",
    "role": "administrator"
  }'
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Verify MySQL is running:
```bash
# Windows
net start MySQL80

# Linux/Mac
sudo systemctl status mysql
```

2. Verify PostgreSQL is running:
```bash
# Windows
net start postgresql-x64-14

# Linux/Mac
sudo systemctl status postgresql
```

3. Check database credentials in `backend/.env`

### Port Already in Use

If port 5000 or 3000 is already in use:

1. Change backend port in `backend/.env`:
```
PORT=5001
```

2. Update frontend proxy in `frontend/package.json`:
```json
"proxy": "http://localhost:5001"
```

### Module Not Found Errors

If you get "module not found" errors:

1. Delete node_modules and package-lock.json:
```bash
rm -rf node_modules package-lock.json
```

2. Reinstall dependencies:
```bash
npm install
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Documentation

Once the backend is running, you can access:

- API Root: `http://localhost:5000`
- Health Check: `http://localhost:5000/health`
- Auth Endpoints: `http://localhost:5000/api/auth/*`
- Customer Endpoints: `http://localhost:5000/api/customers/*`
- Billing Endpoints: `http://localhost:5000/api/billing/*`
- Payment Endpoints: `http://localhost:5000/api/payments/*`
- Admin Endpoints: `http://localhost:5000/api/admin/*`
- Manager Endpoints: `http://localhost:5000/api/manager/*`

## Default Test Credentials

After setting up, you can use these test credentials:

**Administrator:**
- Email: admin@wasco.ls
- Password: Admin@123

**Customer:**
- Email: customer@example.com
- Password: Customer@123

**Branch Manager:**
- Email: manager@wasco.ls
- Password: Manager@123

## Next Steps

1. Explore the API endpoints using Postman or curl
2. Create customers and billing rates through the admin panel
3. Generate water usage records
4. Create bills and process payments
5. View analytics in the manager dashboard

## Support

For issues or questions, refer to:
- README.md
- TECHNICAL_SPECIFICATION.md
- DATABASE_DESIGN.md