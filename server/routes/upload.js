const express = require('express');
const { protect } = require('../middleware/auth');
const {
  uploadAvatar,
  uploadProfilePicture,
  uploadFeaturedImage,
  uploadBlogImage,
  uploadGalleryImage,
  uploadVideoThumbnail,
  uploadVideo,
  uploadDocuments,
  uploadGalleryImages,
  uploadBlogContent,
  uploadAttachment
} = require('../middleware/upload');

const router = express.Router();

// Apply protection to all routes
router.use(protect);

// Helper function to generate response
const generateResponse = (file) => ({
  filename: file.filename,
  path: file.path,
  url: `/${file.path.replace(/\\/g, '/')}`
});

// Single file upload endpoints
router.post('/avatar', uploadAvatar, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

router.post('/profile-picture', uploadProfilePicture, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

router.post('/blog-image', uploadBlogImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

router.post('/featured-image', uploadFeaturedImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

router.post('/gallery-image', uploadGalleryImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

router.post('/video-thumbnail', uploadVideoThumbnail, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

router.post('/video', uploadVideo, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

// Multiple file uploads
router.post('/documents', uploadDocuments, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    });
  }
  
  const files = req.files.map(generateResponse);
  
  res.json({
    success: true,
    data: files
  });
});

router.post('/gallery-images', uploadGalleryImages, (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No files uploaded'
    });
  }
  
  const files = req.files.map(generateResponse);
  
  res.json({
    success: true,
    data: files
  });
});

// Mixed uploads for blog content
router.post('/blog-content', uploadBlogContent, (req, res) => {
  const result = {};
  
  if (req.files.featuredImage) {
    result.featuredImage = generateResponse(req.files.featuredImage[0]);
  }
  
  if (req.files.blogImage) {
    result.blogImages = req.files.blogImage.map(generateResponse);
  }
  
  res.json({
    success: true,
    data: result
  });
});

// Post-session attachment upload
router.post('/attachment', uploadAttachment, (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }
  
  res.json({
    success: true,
    data: generateResponse(req.file)
  });
});

module.exports = router;