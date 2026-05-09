# WASCO Water Bill Management System - API Endpoints Guide

## Base URL
```
http://localhost:5000
```

---

## 🔐 Authentication Endpoints

### 1. Register New User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+26612345678",
  "role": "customer"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: { "token": "jwt_token_here", "user": {...} }
```

### 3. Get User Profile
```
GET http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Update Profile
```
PUT http://localhost:5000/api/auth/profile
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe Updated",
  "phone_number": "+26612345679"
}
```

### 5. Logout
```
POST http://localhost:5000/api/auth/logout
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 👥 Customer Endpoints

### 6. Create Customer
```
POST http://localhost:5000/api/customers
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "account_number": "ACC001",
  "meter_number": "MTR001",
  "customer_type": "residential",
  "address": "123 Main Street, Maseru",
  "district_id": 1,
  "connection_date": "2024-01-01",
  "status": "active"
}
```

### 7. Get All Customers
```
GET http://localhost:5000/api/customers
Authorization: Bearer YOUR_JWT_TOKEN
```

### 8. Get Customer by ID
```
GET http://localhost:5000/api/customers/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### 9. Update Customer
```
PUT http://localhost:5000/api/customers/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "address": "456 New Street, Maseru",
  "status": "active"
}
```

### 10. Delete Customer
```
DELETE http://localhost:5000/api/customers/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### 11. Get Customer Bills
```
GET http://localhost:5000/api/customers/1/bills
Authorization: Bearer YOUR_JWT_TOKEN
```

### 12. Get Customer Payments
```
GET http://localhost:5000/api/customers/1/payments
Authorization: Bearer YOUR_JWT_TOKEN
```

### 13. Get Customer Usage History
```
GET http://localhost:5000/api/customers/1/usage
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 💰 Billing Endpoints

### 14. Get All Billing Rates
```
GET http://localhost:5000/api/billing/rates
Authorization: Bearer YOUR_JWT_TOKEN
```

### 15. Get Active Billing Rates
```
GET http://localhost:5000/api/billing/rates/active
Authorization: Bearer YOUR_JWT_TOKEN
```

### 16. Create Billing Rate (Admin Only)
```
POST http://localhost:5000/api/billing/rates
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "customer_type": "residential",
  "tier_name": "Tier 1 (0-10 m³)",
  "min_usage": 0,
  "max_usage": 10,
  "rate_per_unit": 5.50,
  "effective_date": "2024-01-01",
  "is_active": true
}
```

### 17. Update Billing Rate (Admin Only)
```
PUT http://localhost:5000/api/billing/rates/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "rate_per_unit": 6.00,
  "is_active": true
}
```

### 18. Generate Single Bill
```
POST http://localhost:5000/api/billing/generate
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "customer_id": 1,
  "usage_id": 1,
  "billing_period_start": "2024-01-01",
  "billing_period_end": "2024-01-31"
}
```

### 19. Generate Bulk Bills
```
POST http://localhost:5000/api/billing/generate-bulk
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "billing_period_start": "2024-01-01",
  "billing_period_end": "2024-01-31"
}
```

### 20. Get Bill by ID
```
GET http://localhost:5000/api/billing/bills/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### 21. Get All Bills
```
GET http://localhost:5000/api/billing/bills
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 💳 Payment Endpoints

### 22. Create Payment Intent (Stripe)
```
POST http://localhost:5000/api/payments/create-intent
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "bill_id": 1,
  "amount": 150.00
}

Response: { "clientSecret": "stripe_client_secret" }
```

### 23. Confirm Payment
```
POST http://localhost:5000/api/payments/confirm
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "payment_intent_id": "pi_xxxxx",
  "bill_id": 1
}
```

### 24. Record Manual Payment (Admin Only)
```
POST http://localhost:5000/api/payments/manual
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "bill_id": 1,
  "amount": 150.00,
  "payment_method": "cash",
  "payment_reference": "CASH001"
}
```

### 25. Get Payment by ID
```
GET http://localhost:5000/api/payments/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### 26. Get All Payments
```
GET http://localhost:5000/api/payments
Authorization: Bearer YOUR_JWT_TOKEN
```

### 27. Refund Payment (Admin Only)
```
POST http://localhost:5000/api/payments/1/refund
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "reason": "Billing error"
}
```

---

## 📊 Water Usage Endpoints

### 28. Record Water Usage
```
POST http://localhost:5000/api/usage
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "customer_id": 1,
  "reading_date": "2024-01-31",
  "meter_reading": 125.50,
  "previous_reading": 100.00,
  "reading_type": "actual"
}
```

### 29. Get Usage by ID
```
GET http://localhost:5000/api/usage/1
Authorization: Bearer YOUR_JWT_TOKEN
```

### 30. Get All Usage Records
```
GET http://localhost:5000/api/usage
Authorization: Bearer YOUR_JWT_TOKEN
```

### 31. Update Usage Record
```
PUT http://localhost:5000/api/usage/1
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "meter_reading": 126.00,
  "notes": "Corrected reading"
}
```

---

## 🔧 Admin Dashboard Endpoints

### 32. Get Dashboard Statistics
```
GET http://localhost:5000/api/admin/dashboard
Authorization: Bearer YOUR_JWT_TOKEN (Admin role required)
```

### 33. Get All Users
```
GET http://localhost:5000/api/admin/users
Authorization: Bearer YOUR_JWT_TOKEN (Admin role required)
```

### 34. Update User Role
```
PUT http://localhost:5000/api/admin/users/1/role
Authorization: Bearer YOUR_JWT_TOKEN (Admin role required)
Content-Type: application/json

{
  "role": "branch_manager"
}
```

### 35. Deactivate User
```
PUT http://localhost:5000/api/admin/users/1/deactivate
Authorization: Bearer YOUR_JWT_TOKEN (Admin role required)
```

### 36. Get Revenue Report
```
GET http://localhost:5000/api/admin/reports/revenue?start_date=2024-01-01&end_date=2024-12-31
Authorization: Bearer YOUR_JWT_TOKEN (Admin role required)
```

### 37. Get Outstanding Balances Report
```
GET http://localhost:5000/api/admin/reports/outstanding
Authorization: Bearer YOUR_JWT_TOKEN (Admin role required)
```

---

## 📈 Branch Manager Analytics Endpoints

### 38. Get Daily Analytics
```
GET http://localhost:5000/api/manager/analytics/daily?date=2024-01-31
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

### 39. Get Weekly Analytics
```
GET http://localhost:5000/api/manager/analytics/weekly?week=5&year=2024
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

### 40. Get Monthly Analytics
```
GET http://localhost:5000/api/manager/analytics/monthly?month=1&year=2024
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

### 41. Get Quarterly Analytics
```
GET http://localhost:5000/api/manager/analytics/quarterly?quarter=1&year=2024
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

### 42. Get Yearly Analytics
```
GET http://localhost:5000/api/manager/analytics/yearly?year=2024
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

### 43. Get District Statistics
```
GET http://localhost:5000/api/manager/districts/1/stats
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

### 44. Get Customer Segment Analysis
```
GET http://localhost:5000/api/manager/analysis/segments
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

### 45. Get Usage Patterns
```
GET http://localhost:5000/api/manager/analysis/patterns?customer_type=residential
Authorization: Bearer YOUR_JWT_TOKEN (Manager role required)
```

---

## 🌍 District Endpoints

### 46. Get All Districts
```
GET http://localhost:5000/api/districts
```

### 47. Get District by ID
```
GET http://localhost:5000/api/districts/1
```

### 48. Get District Customers
```
GET http://localhost:5000/api/districts/1/customers
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🏥 Health Check Endpoints

### 49. Health Check
```
GET http://localhost:5000/health
```

### 50. API Root
```
GET http://localhost:5000
```

---

## 📝 Testing with Postman/Thunder Client

### Step 1: Register a User
```
POST http://localhost:5000/api/auth/register
Body: { "username": "testuser", "email": "test@example.com", "password": "Test123", "first_name": "Test", "last_name": "User", "role": "customer" }
```

### Step 2: Login
```
POST http://localhost:5000/api/auth/login
Body: { "email": "test@example.com", "password": "Test123" }
Copy the token from response
```

### Step 3: Create Customer
```
POST http://localhost:5000/api/customers
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "account_number": "ACC001", "meter_number": "MTR001", "customer_type": "residential", "address": "Test Address", "district_id": 1, "connection_date": "2024-01-01" }
```

### Step 4: Record Water Usage
```
POST http://localhost:5000/api/usage
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "customer_id": 1, "reading_date": "2024-01-31", "meter_reading": 125.50, "previous_reading": 100.00 }
```

### Step 5: Generate Bill
```
POST http://localhost:5000/api/billing/generate
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "customer_id": 1, "usage_id": 1, "billing_period_start": "2024-01-01", "billing_period_end": "2024-01-31" }
```

### Step 6: View Bills
```
GET http://localhost:5000/api/customers/1/bills
Headers: Authorization: Bearer YOUR_TOKEN
```

---

## 🎯 Complete Workflow Example

1. **Register** → Get user account
2. **Login** → Get JWT token
3. **Create Customer** → Link user to customer account
4. **Record Usage** → Add meter reading
5. **Generate Bill** → Calculate bill based on usage
6. **Create Payment** → Process payment
7. **View History** → Check bills and payments

---

## 📊 All 10 Lesotho Districts Available

1. Maseru (district_id: 1)
2. Berea (district_id: 2)
3. Leribe (district_id: 3)
4. Mafeteng (district_id: 4)
5. Mohale's Hoek (district_id: 5)
6. Quthing (district_id: 6)
7. Qacha's Nek (district_id: 7)
8. Mokhotlong (district_id: 8)
9. Thaba-Tseka (district_id: 9)
10. Butha-Buthe (district_id: 10)

---

## 🔑 Authentication Notes

- All endpoints except `/health`, `/`, `/api/auth/register`, `/api/auth/login`, and `/api/districts` require authentication
- Include JWT token in Authorization header: `Authorization: Bearer YOUR_TOKEN`
- Tokens expire after 24 hours (configurable in .env)
- Admin and Manager roles have additional permissions

---

## ✅ Your Complete System Has:

- ✅ 50+ Working API Endpoints
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Distributed Databases (MySQL + PostgreSQL)
- ✅ Bill Calculation Engine
- ✅ Payment Processing
- ✅ OLAP Analytics
- ✅ All 10 Lesotho Districts
- ✅ Complete CRUD Operations

**Test these endpoints with Postman or Thunder Client to demonstrate full functionality!**