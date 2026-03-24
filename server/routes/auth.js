const express = require('express');
const {
  register,
  login,
  googleLogin,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyOTP,
  verifyEmail,
  resendOTP,
  logout
} = require('../controllers/authController');

const { protect, refreshToken } = require('../middleware/auth');
const { uploadAvatar } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.post('/register', register); // Public registration for clients only
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, uploadAvatar, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.get('/logout', protect, logout);

module.exports = router;