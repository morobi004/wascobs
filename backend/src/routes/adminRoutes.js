const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication and administrator role
router.use(authenticate);
router.use(authorize(['administrator']));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Customer Management
router.get('/customers', adminController.getAllCustomers);
router.post('/customers', adminController.createCustomer);
router.put('/customers/:id', adminController.updateCustomer);
router.delete('/customers/:id', adminController.deleteCustomer);

// Billing Rate Management
router.get('/billing-rates', adminController.getAllBillingRates);
router.post('/billing-rates', adminController.createBillingRate);
router.put('/billing-rates/:id', adminController.updateBillingRate);
router.delete('/billing-rates/:id', adminController.deleteBillingRate);

// Reports
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/consumption', adminController.getConsumptionReport);
router.get('/reports/districts', adminController.getDistrictReport);

module.exports = router;

// Made with Bob
