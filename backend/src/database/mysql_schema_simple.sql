const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication and branch_manager/administrator role
router.use(authenticate);
router.use(authorize(['branch_manager', 'administrator']));

// OLAP Analytics Routes
router.get('/analytics/daily', managerController.getDailyAnalytics);
router.get('/analytics/weekly', managerController.getWeeklyAnalytics);
router.get('/analytics/monthly', managerController.getMonthlyAnalytics);
router.get('/analytics/quarterly', managerController.getQuarterlyAnalytics);
router.get('/analytics/yearly', managerController.getYearlyAnalytics);

// Water Usage Analytics
router.get('/analytics/usage', managerController.getUsageAnalytics);
router.get('/analytics/top-consumers', managerController.getTopConsumers);

// Customer Analytics
router.get('/analytics/customer-segmentation', managerController.getCustomerSegmentation);

// Payment Analytics
router.get('/analytics/payment-trends', managerController.getPaymentTrends);

// Financial Analytics
router.get('/analytics/outstanding', managerController.getOutstandingAnalysis);
router.get('/analytics/revenue-forecast', managerController.getRevenueForecast);

// District Comparison
router.get('/analytics/district-comparison', managerController.getDistrictComparison);

module.exports = router;

// Made with Bob
