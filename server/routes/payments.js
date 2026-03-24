const express = require('express');
const {
  getPaymentSettings,
  updatePaymentSettings,
  calculatePayment,
  processPayment,
  generateInvoice,
  getClientPaymentHistory
} = require('../controllers/paymentController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Admin routes
router.get('/admin/settings', protect, authorize('admin'), getPaymentSettings);
router.put('/admin/settings', protect, authorize('admin'), updatePaymentSettings);

// General payment routes
router.post('/calculate', protect, calculatePayment);
router.post('/process', protect, processPayment);
router.get('/invoice/:appointmentId', protect, generateInvoice);

// Client payment history
router.get('/client/history', protect, authorize('client'), getClientPaymentHistory);

module.exports = router;