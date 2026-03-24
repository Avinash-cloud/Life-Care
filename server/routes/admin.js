const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  banUser,
  getCounsellors,
  getCounsellor,
  createCounsellor,
  updateCounsellor,
  deleteCounsellor,
  verifyCounsellor,
  getAppointments,
  updatePaymentStatus,
  handleDispute,
  getWithdrawals,
  processWithdrawal,
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getGallery,
  uploadGalleryImage: uploadGalleryImageController,
  deleteGalleryImage,
  getReports,
  getDashboardStats,
  getSettings,
  updateSettings,
  getCallbackRequests,
  updateCallbackRequest,
  deleteCallbackRequest
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/auth');
const { uploadFeaturedImage, uploadGalleryImage: uploadGalleryImageMiddleware, uploadVideoThumbnail, uploadAvatar } = require('../middleware/upload');

const router = express.Router();

// Apply protection to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard route
router.get('/dashboard', getDashboardStats);

// User routes
router.route('/users')
  .get(getUsers)
  .post(createUser);

router.route('/users/:id')
  .get(getUser)
  .put(uploadAvatar, updateUser)
  .delete(deleteUser);

router.put('/users/:id/ban', banUser);

// Counsellor routes
router.route('/counsellors')
  .get(getCounsellors)
  .post(createCounsellor);

router.route('/counsellors/:id')
  .get(getCounsellor)
  .put(updateCounsellor)
  .delete(deleteCounsellor);

router.put('/counsellors/:id/verify', verifyCounsellor);

// Appointment routes
router.get('/appointments', getAppointments);
router.put('/appointments/:id/payment', updatePaymentStatus);
router.put('/disputes/:id', handleDispute);

// Withdrawal routes
router.get('/withdrawals', getWithdrawals);
router.put('/withdrawals/:id', processWithdrawal);

// CMS routes
router.route('/cms/blogs')
  .get(getBlogs)
  .post(uploadFeaturedImage, createBlog);

router.route('/cms/blogs/:id')
  .get(getBlog)
  .put(uploadFeaturedImage, updateBlog)
  .delete(deleteBlog);

router.route('/cms/videos')
  .get(getVideos)
  .post(uploadVideoThumbnail, createVideo);

router.route('/cms/videos/:id')
  .put(uploadVideoThumbnail, updateVideo)
  .delete(deleteVideo);

router.route('/cms/gallery')
  .get(getGallery)
  .post(uploadGalleryImageMiddleware, uploadGalleryImageController);

router.delete('/cms/gallery/:id', deleteGalleryImage);

// Reports and Analytics
router.get('/reports', getReports);

// Settings
router.route('/settings')
  .get(getSettings)
  .put(updateSettings);

// Callback request routes
router.route('/callbacks')
  .get(getCallbackRequests);

router.route('/callbacks/:id')
  .put(updateCallbackRequest)
  .delete(deleteCallbackRequest);

module.exports = router;
