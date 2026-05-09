const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Bill routes
router.get('/', billingController.getAll);
router.get('/:id', billingController.getById);
router.post('/generate', authorize(['administrator']), billingController.generateBill);
router.post('/generate-bulk', authorize(['administrator']), billingController.generateBulkBills);
router.put('/:id', authorize(['administrator']), billingController.updateBill);
router.delete('/:id', authorize(['administrator']), billingController.deleteBill);

// Bill queries
router.get('/outstanding/:account_number', billingController.getOutstandingBills);
router.get('/summary/stats', billingController.getBillingSummary);

// Billing rates
router.get('/rates/all', billingController.getBillingRates);
router.post('/rates', authorize(['administrator']), billingController.createBillingRate);
router.put('/rates/:id', authorize(['administrator']), billingController.updateBillingRate);
router.delete('/rates/:id', authorize(['administrator']), billingController.deleteBillingRate);

module.exports = router;

// Made with Bob
