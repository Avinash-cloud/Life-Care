const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    
    switch (file.fieldname) {
      case 'avatar':
      case 'profilePicture':
        uploadPath = 'uploads/profiles/';
        break;
      case 'featuredImage':
      case 'blogImage':
        uploadPath = 'uploads/blogs/';
        break;
      case 'galleryImage':
        uploadPath = 'uploads/gallery/';
        break;
      case 'videoThumbnail':
      case 'video':
        uploadPath = 'uploads/videos/';
        break;
      case 'documents':
        uploadPath = 'uploads/documents/';
        break;
      case 'file':
        uploadPath = 'uploads/attachments/';
        break;
      default:
        uploadPath = 'uploads/misc/';
    }
    
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    const allowedTypes = /mp4|avi|mov|wmv|flv|webm/;
    const allowedMimes = /video\/(mp4|avi|mov|wmv|flv|webm)/;
    
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  } else if (file.fieldname === 'file') {
    // For post-session attachments - allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const allowedMimes = /image\/(jpeg|jpg|png|gif)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)/;
    
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and document files are allowed'));
    }
  } else {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const allowedMimes = /image\/(jpeg|jpg|png|gif)/;
    
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
};

// Create multer instance for images
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter
});

// Create multer instance for videos with larger file size limit
const videoUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
  fileFilter
});

module.exports = {
  uploadAvatar: upload.single('avatar'),
  uploadProfilePicture: upload.single('profilePicture'),
  uploadFeaturedImage: upload.single('featuredImage'),
  uploadBlogImage: upload.single('blogImage'),
  uploadGalleryImage: upload.single('galleryImage'),
  uploadVideoThumbnail: upload.single('videoThumbnail'),
  uploadVideo: videoUpload.single('video'),
  uploadDocuments: upload.array('documents', 5),
  uploadGalleryImages: upload.array('galleryImage', 10),
  uploadBlogContent: upload.fields([
    { name: 'featuredImage', maxCount: 1 },
    { name: 'blogImage', maxCount: 5 }
  ]),
  uploadAttachment: upload.single('file')
};