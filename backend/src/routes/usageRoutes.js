const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Water usage routes
router.get('/', usageController.getAll);
router.get('/:id', usageController.getById);
router.get('/account/:accountNumber', usageController.getByAccountNumber);
router.post('/', authorize(['administrator']), usageController.create);
router.put('/:id', authorize(['administrator']), usageController.update);
router.delete('/:id', authorize(['administrator']), usageController.delete);

module.exports = router;

// Made with Bob
