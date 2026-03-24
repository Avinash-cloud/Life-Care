const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');
const {
  getProfile,
  updateProfile,
  updateAvailability,
  uploadVerificationDocuments,
  getAppointments,
  getAppointment,
  updateAppointmentStatus,
  addSessionNotes,
  getEarnings,
  requestWithdrawal,
  createBlog,
  uploadVideo
} = require('../controllers/counsellorController');

const router = express.Router();

// Apply protection to all routes
router.use(protect);
router.use(authorize('counsellor'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', uploadAvatar, updateProfile);
router.put('/availability', updateAvailability);
router.post('/verification', uploadVerificationDocuments);

// Appointment routes
router.get('/appointments', getAppointments);
router.get('/appointments/:id', getAppointment);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.post('/appointments/:id/notes', addSessionNotes);

// Earnings routes
router.get('/earnings', getEarnings);
router.post('/withdrawals', requestWithdrawal);

// Content routes
router.post('/blogs', createBlog);
router.post('/videos', uploadVideo);

module.exports = router;