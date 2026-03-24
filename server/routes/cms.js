const express = require('express');
const {
  getBlogs,
  getBlog,
  getBlogCategories,
  getVideos,
  getVideo,
  getVideoCategories,
  getGallery,
  getGalleryCategories,
  getPublicCounsellors
} = require('../controllers/cmsController');

const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Apply optional auth to all routes
router.use(optionalAuth);

// Blog routes
router.get('/blogs', getBlogs);
router.get('/blogs/categories', getBlogCategories);
router.get('/blogs/:slug', getBlog);

// Video routes
router.get('/videos', getVideos);
router.get('/videos/categories', getVideoCategories);
router.get('/videos/:id', getVideo);

// Gallery routes
router.get('/gallery', getGallery);
router.get('/gallery/categories', getGalleryCategories);

// Public counsellors route
router.get('/counsellors', getPublicCounsellors);

module.exports = router;