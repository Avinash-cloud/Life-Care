const express = require('express');
const {
  getAvailableSlots,
  bookAppointment,
  verifyPayment
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/available-slots', getAvailableSlots);
router.post('/book', bookAppointment);
router.post('/verify-payment', verifyPayment);

module.exports = router;