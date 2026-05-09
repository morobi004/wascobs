const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Customer routes - accessible by admin and the customer themselves
router.get('/', authorize(['administrator']), customerController.getAll);
router.get('/:id', customerController.getById);
router.get('/account/:accountNumber', customerController.getByAccountNumber);
router.post('/', authorize(['administrator']), customerController.create);
router.put('/:id', authorize(['administrator']), customerController.update);
router.delete('/:id', authorize(['administrator']), customerController.delete);

// Customer-specific data
router.get('/:accountNumber/bills', customerController.getBills);
router.get('/:accountNumber/payments', customerController.getPayments);
router.get('/:accountNumber/usage-history', customerController.getUsageHistory);

module.exports = router;

// Made with Bob
