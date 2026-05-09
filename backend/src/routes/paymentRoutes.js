const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/auth');

// Webhook route (no authentication required)
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

// All other routes require authentication
router.use(authenticate);

// Payment routes
router.get('/', paymentController.getAll);
router.get('/:id', paymentController.getById);
router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.post('/manual', authorize(['administrator']), paymentController.recordManualPayment);
router.post('/:id/refund', authorize(['administrator']), paymentController.refundPayment);

// Payment queries
router.get('/history/:account_number', paymentController.getPaymentHistory);
router.get('/summary/stats', authorize(['administrator', 'branch_manager']), paymentController.getPaymentSummary);

module.exports = router;

// Made with Bob
