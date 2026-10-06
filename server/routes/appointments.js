const express = require('express');
const {
  getAvailableSlots,
  bookAppointment,
  verifyPayment,
  publicBookAppointment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes for website visitors & booking calendar
router.get('/available-slots', getAvailableSlots);
router.post('/public-book', publicBookAppointment);

// Protected routes for authenticated clients
router.use(protect);
router.post('/book', bookAppointment);
router.post('/verify-payment', verifyPayment);

module.exports = router;