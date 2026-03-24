const express = require('express');
const {
  getProfile,
  updateProfile,
  getCounsellors,
  getCounsellor,
  bookAppointment,
  getAppointments,
  getAppointment,
  cancelAppointment,
  submitReview,
  getReviews
} = require('../controllers/clientController');

const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

const router = express.Router();

// Apply protection to all routes
router.use(protect);
router.use(authorize('client'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', uploadAvatar, updateProfile);

// Counsellor routes
router.get('/counsellors', getCounsellors);
router.get('/counsellors/:id', getCounsellor);

// Appointment routes
router.post('/appointments', bookAppointment);
router.get('/appointments', getAppointments);
router.get('/appointments/:id', getAppointment);
router.put('/appointments/:id/cancel', cancelAppointment);

// Review routes
router.post('/reviews', submitReview);
router.get('/reviews', getReviews);

module.exports = router;