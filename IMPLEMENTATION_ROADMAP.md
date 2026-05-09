# WASCO Water Bill Management System - Implementation Roadmap

## Project Summary

**Technology Stack:**
- **Backend**: Node.js + Express.js (MVC Architecture)
- **Frontend**: React.js with Redux Toolkit
- **Databases**: MySQL (Primary) + PostgreSQL (Analytics) - Heterogeneous Distributed Setup
- **Payment**: Stripe API Integration
- **Authentication**: JWT Tokens

---

## Phase 1: Project Setup & Foundation (Week 1-2)

### 1.1 Backend Setup
```bash
# Initialize backend project
mkdir wasco-water-billing
cd wasco-water-billing
mkdir backend frontend
cd backend
npm init -y

# Install core dependencies
npm install express sequelize mysql2 pg pg-hstore
npm install jsonwebtoken bcryptjs dotenv cors helmet
npm install express-validator morgan winston
npm install stripe nodemailer

# Install dev dependencies
npm install --save-dev nodemon jest supertest
```

### 1.2 Frontend Setup
```bash
cd ../frontend
npx create-react-app .

# Install dependencies
npm install @reduxjs/toolkit react-redux
npm install @mui/material @emotion/react @emotion/styled
npm install axios react-router-dom
npm install recharts formik yup
npm install @mui/icons-material @mui/x-data-grid
```

### 1.3 Database Setup
- Install MySQL 8.0 and PostgreSQL 15
- Create databases: `wasco_primary` (MySQL) and `wasco_analytics` (PostgreSQL)
- Configure database users and permissions
- Set up database connection pooling

### 1.4 Environment Configuration
Create `.env` files for both backend and frontend with all required variables

---

## Phase 2: Database Design & Implementation (Week 2-3)

### 2.1 MySQL Primary Database
- Create all 10 tables (Users, Districts, Customers, BillingRates, WaterUsage, Bills, Payments, Notifications, LeakageReports, AuditLog)
- Implement foreign key constraints and indexes
- Create SQL views for data abstraction
- Implement stored procedures for bill calculation
- Set up triggers for automatic updates
- Create scheduled events for overdue bills

### 2.2 PostgreSQL Analytics Database
- Create analytics tables (CustomerAnalytics, UsageAnalytics, DistrictAnalytics, RevenueAnalytics, PaymentTrends, ConsumptionPatterns)
- Implement materialized views
- Create analytics functions
- Set up indexes for query optimization

### 2.3 Seed Data
- Insert all 10 Lesotho districts
- Create admin and manager users
- Add billing rate tiers
- Generate sample customers (at least 50)
- Create sample usage and billing data

### 2.4 Access Control
- Implement SQL GRANT/REVOKE statements
- Create role-based database users
- Set up view-based security

---

## Phase 3: Backend Development (Week 3-5)

### 3.1 Core Setup
```
backend/src/
├── config/
│   ├── database.js          # MySQL + PostgreSQL connections
│   ├── stripe.js            # Stripe configuration
│   └── env.js               # Environment variables
├── models/
│   ├── mysql/               # Sequelize models for MySQL
│   └── postgresql/          # Sequelize models for PostgreSQL
├── controllers/             # Request handlers
├── services/                # Business logic
├── middleware/              # Auth, validation, error handling
├── routes/                  # API routes
├── utils/                   # Helper functions
└── views/                   # SQL views
```

### 3.2 Authentication System
- User registration with password hashing (bcrypt)
- Login with JWT token generation
- Token refresh mechanism
- Password reset functionality
- Role-based authorization middleware

### 3.3 Models Implementation
**MySQL Models:**
- User, District, Customer, BillingRate, WaterUsage, Bill, Payment, Notification, LeakageReport, AuditLog

**PostgreSQL Models:**
- CustomerAnalytics, UsageAnalytics, DistrictAnalytics, RevenueAnalytics

### 3.4 Services Layer
- **authService.js**: Authentication logic
- **billCalculationService.js**: Complex billing calculations with embedded SQL
- **paymentService.js**: Payment processing logic
- **stripeService.js**: Stripe API integration
- **notificationService.js**: Email/SMS notifications
- **analyticsService.js**: Data aggregation and reporting
- **syncService.js**: MySQL ↔ PostgreSQL synchronization

### 3.5 Controllers
- authController: Register, login, logout, refresh token
- customerController: CRUD operations for customers
- billingController: Bill generation, retrieval, updates
- usageController: Meter reading management
- paymentController: Payment processing, history
- adminController: Admin operations (manage rates, customers, bills)
- managerController: Analytics and reporting
- notificationController: Notification management
- leakageController: Leakage report handling

### 3.6 API Routes
```javascript
// Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token

// Customer Portal
GET    /api/customer/profile
PUT    /api/customer/profile
GET    /api/customer/bills
GET    /api/customer/usage-history
GET    /api/customer/payment-history
POST   /api/customer/report-leakage

// Payments
POST   /api/payments/create-intent
POST   /api/payments/confirm
POST   /api/payments/webhook
GET    /api/payments/:paymentId

// Administrator
GET    /api/admin/customers
POST   /api/admin/customers
PUT    /api/admin/customers/:id
GET    /api/admin/billing-rates
POST   /api/admin/billing-rates
POST   /api/admin/bills/generate

// Branch Manager
GET    /api/manager/dashboard
GET    /api/manager/analytics/usage
GET    /api/manager/analytics/revenue
GET    /api/manager/reports/monthly

// Public
GET    /api/public/services
GET    /api/public/districts
```

### 3.7 Distributed Database Sync
- Real-time event listeners for critical data
- Batch synchronization jobs (hourly/daily)
- Data transformation and aggregation
- Conflict resolution strategy
- Error handling and retry logic

---

## Phase 4: Frontend Development (Week 5-7)

### 4.1 Project Structure
```
frontend/src/
├── components/
│   ├── common/              # Reusable components
│   ├── auth/                # Login, Register
│   ├── customer/            # Customer portal
│   ├── admin/               # Admin dashboard
│   ├── manager/             # Manager dashboard
│   └── public/              # Public pages
├── redux/
│   ├── store.js
│   └── slices/              # Redux slices
├── services/
│   └── api.js               # Axios configuration
├── utils/
│   ├── formatters.js
│   └── validators.js
├── App.jsx
└── routes.jsx
```

### 4.2 Authentication Components
- Login page with form validation
- Registration page for new customers
- Password reset functionality
- Protected route wrapper

### 4.3 Customer Portal
- Dashboard with summary cards
- Bill history table with filters
- Payment history with receipts
- Usage chart (line/bar chart)
- Make payment form (Stripe integration)
- Report leakage form with location

### 4.4 Administrator Dashboard
- Customer management (CRUD operations)
- Billing rates management
- Bill generation interface
- Payment tracking
- User management

### 4.5 Branch Manager Dashboard
- Analytics overview with KPIs
- Usage reports with charts
- Revenue reports with trends
- District comparison
- Time-based reports (daily, weekly, monthly, quarterly, yearly)
- Export functionality (PDF, Excel)

### 4.6 Public Pages
- Home page with service information
- Services listing
- Contact form
- District information

### 4.7 State Management
- Redux slices for auth, customer, bills, payments, analytics
- Async thunks for API calls
- Loading and error states
- Caching strategy

---

## Phase 5: Integration & Features (Week 7-9)

### 5.1 Stripe Payment Integration
- Create payment intents
- Handle payment confirmation
- Implement webhook for payment events
- Store transaction details
- Generate payment receipts

### 5.2 Notification System
- Bill generation notifications (email/SMS)
- Payment confirmation notifications
- Overdue payment reminders
- System announcements
- District-specific notifications for all 10 districts

### 5.3 Water Leakage Reporting
- Public reporting form
- GPS location capture
- Severity classification
- Status tracking workflow
- Assignment to maintenance teams
- Resolution tracking

### 5.4 Analytics & Reporting
- OLAP queries for multi-dimensional analysis
- Usage pattern analysis by customer segments
- Revenue trends and forecasting
- Collection rate monitoring
- District performance comparison
- Custom date range reports

### 5.5 Data Visualization
- Usage charts (line, bar, pie)
- Revenue dashboards
- District comparison charts
- Payment method distribution
- Consumption category breakdown

---

## Phase 6: Testing & Quality Assurance (Week 9-10)

### 6.1 Unit Tests
- Model validation tests
- Service logic tests
- Utility function tests
- Bill calculation algorithm tests

### 6.2 Integration Tests
- API endpoint tests
- Database operation tests
- Payment processing tests
- Authentication flow tests

### 6.3 End-to-End Tests
- User registration and login
- Bill generation and payment
- Admin operations
- Manager reports
- Leakage reporting

### 6.4 Security Audit
- SQL injection prevention
- XSS protection
- CSRF protection
- Authentication security
- Authorization checks
- Data encryption
- API rate limiting

---

## Phase 7: Documentation & Deployment (Week 10-12)

### 7.1 API Documentation
- Swagger/OpenAPI specification
- Endpoint descriptions
- Request/response examples
- Authentication requirements
- Error codes and messages

### 7.2 User Documentation
- Customer user guide
- Administrator manual
- Branch manager guide
- FAQ section
- Troubleshooting guide

### 7.3 Technical Documentation
- System architecture
- Database schema
- API reference
- Deployment guide
- Maintenance procedures

### 7.4 Deployment Setup
- Production environment configuration
- Database migration scripts
- Server setup (Node.js with PM2)
- Nginx reverse proxy configuration
- SSL certificate setup
- Database backup automation
- Monitoring and logging setup

### 7.5 Performance Optimization
- Database query optimization
- API response caching
- Frontend code splitting
- Image optimization
- CDN setup for static assets

---

## Key SQL Queries to Implement

### 1. Bill Calculation Query
```sql
SELECT 
    wu.usage_id,
    wu.account_number,
    wu.consumption,
    br.cost_per_unit,
    br.fixed_charge,
    br.sewerage_charge_percentage,
    (wu.consumption * br.cost_per_unit) AS water_charge,
    ((wu.consumption * br.cost_per_unit) * br.sewerage_charge_percentage / 100) AS sewerage_charge,
    br.fixed_charge,
    ((wu.consumption * br.cost_per_unit) + 
     ((wu.consumption * br.cost_per_unit) * br.sewerage_charge_percentage / 100) + 
     br.fixed_charge) AS total_amount
FROM water_usage wu
JOIN customers c ON wu.account_number = c.account_number
JOIN billing_rates br ON c.connection_type = br.connection_type
    AND wu.consumption BETWEEN br.usage_range_min AND COALESCE(br.usage_range_max, 999999)
WHERE wu.usage_id = ?;
```

### 2. Outstanding Balances Query
```sql
SELECT 
    c.account_number,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    d.district_name,
    SUM(b.balance) AS outstanding_balance,
    COUNT(CASE WHEN b.payment_status = 'overdue' THEN 1 END) AS overdue_bills
FROM customers c
INNER JOIN bills b ON c.account_number = b.account_number
LEFT JOIN districts d ON c.district_id = d.district_id
WHERE b.payment_status IN ('unpaid', 'partial', 'overdue')
GROUP BY c.account_number
HAVING outstanding_balance > 0;
```

### 3. Usage Pattern Analysis (OLAP)
```sql
SELECT 
    d.district_name,
    c.connection_type,
    wu.reading_year,
    wu.reading_month,
    COUNT(DISTINCT c.account_number) AS customer_count,
    AVG(wu.consumption) AS avg_consumption,
    SUM(wu.consumption) AS total_consumption
FROM water_usage wu
JOIN customers c ON wu.account_number = c.account_number
JOIN districts d ON c.district_id = d.district_id
GROUP BY d.district_name, c.connection_type, wu.reading_year, wu.reading_month
ORDER BY wu.reading_year DESC, wu.reading_month DESC;
```

---

## Lesotho Districts Coverage

The system will support all 10 districts:
1. **Maseru** - Capital district (Lowlands)
2. **Berea** - Lowlands region
3. **Leribe** - Lowlands region
4. **Mafeteng** - Lowlands region
5. **Mohale's Hoek** - Lowlands region
6. **Quthing** - Lowlands region
7. **Qacha's Nek** - Mountains region
8. **Mokhotlong** - Mountains region
9. **Thaba-Tseka** - Mountains region
10. **Butha-Buthe** - Lowlands region

Each district will have:
- Dedicated notification templates
- District-specific analytics
- Branch manager assignments
- Localized reporting

---

## Security Measures

### Authentication & Authorization
- JWT tokens with 7-day expiry
- Refresh tokens with 30-day expiry
- Password hashing with bcrypt (10 rounds)
- Role-based access control (Customer, Administrator, Branch Manager)

### Data Protection
- Parameterized SQL queries (prevent SQL injection)
- Input sanitization (prevent XSS)
- CSRF tokens for state-changing operations
- HTTPS enforcement in production
- Rate limiting on API endpoints (100 requests/15 minutes)

### Payment Security
- PCI DSS compliance through Stripe
- No storage of card details
- Webhook signature verification
- Transaction logging and audit trail

### Database Security
- SQL views for data abstraction
- GRANT/REVOKE for access control
- Encrypted database connections
- Regular automated backups
- Data validation and sanitization

---

## Performance Considerations

### Database Optimization
- Proper indexing on frequently queried columns
- Query optimization with EXPLAIN
- Connection pooling
- Materialized views for complex analytics
- Partitioning for large tables (if needed)

### API Optimization
- Response caching with Redis (optional)
- Pagination for large datasets
- Compression (gzip)
- Efficient data serialization

### Frontend Optimization
- Code splitting and lazy loading
- Image optimization
- Memoization of expensive computations
- Virtual scrolling for large lists

---

## Monitoring & Maintenance

### Logging
- Application logs (Winston)
- Error tracking
- API request/response logging
- Database query logging

### Monitoring
- Server health checks
- Database performance metrics
- API response times
- Error rates
- Payment transaction monitoring

### Backup Strategy
- Daily automated database backups
- Weekly full backups
- Monthly archive backups
- Backup retention: 30 days
- Disaster recovery plan

---

## Success Metrics

### Technical Metrics
- API response time < 200ms (95th percentile)
- Database query time < 100ms
- System uptime > 99.5%
- Zero critical security vulnerabilities

### Business Metrics
- Bill generation accuracy: 100%
- Payment processing success rate > 98%
- Customer satisfaction score > 4.0/5.0
- Collection rate improvement tracking

---

## Risk Mitigation

### Technical Risks
- **Database sync failures**: Implement retry logic and manual sync tools
- **Payment gateway downtime**: Queue payments for retry
- **Data loss**: Regular backups and replication
- **Security breaches**: Regular security audits and updates

### Business Risks
- **User adoption**: Comprehensive training and documentation
- **Data accuracy**: Validation at multiple levels
- **System downtime**: Redundancy and failover mechanisms

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Set up development environment** (databases, tools)
3. **Create project repositories** (Git)
4. **Begin Phase 1** implementation
5. **Establish regular check-ins** for progress tracking

---

## Estimated Timeline

- **Total Duration**: 10-12 weeks
- **Phase 1**: 1-2 weeks (Setup)
- **Phase 2**: 1 week (Database)
- **Phase 3**: 2-3 weeks (Backend)
- **Phase 4**: 2-3 weeks (Frontend)
- **Phase 5**: 2 weeks (Integration)
- **Phase 6**: 1 week (Testing)
- **Phase 7**: 1-2 weeks (Documentation & Deployment)

---

## Resources Required

### Development Team
- 1 Full-stack Developer (or 1 Backend + 1 Frontend)
- 1 Database Administrator (part-time)
- 1 QA Tester (part-time)

### Infrastructure
- Development server
- MySQL database server
- PostgreSQL database server
- Production server (cloud or on-premise)
- Domain and SSL certificate

### Third-party Services
- Stripe account (payment processing)
- Email service (SendGrid, Mailgun, or SMTP)
- SMS service (optional, for notifications)

---

## Conclusion

This implementation roadmap provides a comprehensive guide for building the WASCO Water Bill Management System using JavaScript with MVC architecture. The system will meet all project requirements including:

✅ Distributed heterogeneous databases (MySQL + PostgreSQL)
✅ MVC architecture with Node.js + Express.js
✅ Modern React.js frontend
✅ Secure payment processing with Stripe
✅ Comprehensive analytics and reporting
✅ Coverage of all 10 Lesotho districts
✅ Advanced SQL features (views, stored procedures, triggers, OLAP)
✅ Role-based access control
✅ Water leakage reporting
✅ Notification system

The project is well-structured, scalable, and production-ready.