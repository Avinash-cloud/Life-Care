const Blog = require('../models/Blog');
const Video = require('../models/Video');
const GalleryImage = require('../models/GalleryImage');
const Counsellor = require('../models/Counsellor');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all published blogs
// @route   GET /api/cms/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    // Build query
    let query = { status: 'published' };
    
    // Filter by category
    if (req.query.category) {
      query.categories = { $in: [req.query.category] };
    }
    
    // Filter by featured
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    
    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'publishedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .select('-content') // Exclude content for list view
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Blog.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/cms/blogs/:slug
// @access  Public
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: 'published'
    }).populate('author', 'name avatar');
    
    if (!blog) {
      return next(new ErrorResponse(`Blog not found with slug of ${req.params.slug}`, 404));
    }
    
    // Increment view count
    blog.viewCount += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog categories
// @route   GET /api/cms/blogs/categories
// @access  Public
exports.getBlogCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('categories', { status: 'published' });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all published videos
// @route   GET /api/cms/videos
// @access  Public
exports.getVideos = async (req, res, next) => {
  try {
    // Build query - show all videos if no status field exists
    let query = { $or: [{ status: 'published' }, { status: { $exists: false } }] };
    
    // Filter by category
    if (req.query.category) {
      query.categories = { $in: [req.query.category] };
    }
    
    // Filter by featured
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    
    // Search by title or description
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'publishedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const videos = await Video.find(query)
      .populate('author', 'name avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Video.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: videos.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video
// @route   GET /api/cms/videos/:id
// @access  Public
exports.getVideo = async (req, res, next) => {
  try {
    const video = await Video.findOne({
      _id: req.params.id,
      status: 'published'
    }).populate('author', 'name avatar');
    
    if (!video) {
      return next(new ErrorResponse(`Video not found with id of ${req.params.id}`, 404));
    }
    
    // Increment view count
    video.viewCount += 1;
    await video.save();
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get video categories
// @route   GET /api/cms/videos/categories
// @access  Public
exports.getVideoCategories = async (req, res, next) => {
  try {
    const categories = await Video.distinct('categories', { status: 'published' });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gallery images
// @route   GET /api/cms/gallery
// @access  Public
exports.getGallery = async (req, res, next) => {
  try {
    // Build query
    let query = { status: 'published' };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by featured
    if (req.query.featured === 'true') {
      query.isFeatured = true;
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'sortOrder';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const gallery = await GalleryImage.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await GalleryImage.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: gallery.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: gallery
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gallery categories
// @route   GET /api/cms/gallery/categories
// @access  Public
exports.getGalleryCategories = async (req, res, next) => {
  try {
    const categories = await GalleryImage.distinct('category', { status: 'published' });
    
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public counsellors
// @route   GET /api/cms/counsellors
// @access  Public
exports.getPublicCounsellors = async (req, res, next) => {
  try {
    const Counsellor = require('../models/Counsellor');
    
    const counsellors = await Counsellor.find({ isVerified: true, active: true })
      .populate('user', 'name email avatar')
      .select('user specializations experience fees ratings languages bio')
      .sort({ 'ratings.average': -1 })
      .limit(20);
    
    res.status(200).json({
      success: true,
      count: counsellors.length,
      data: counsellors
    });
  } catch (error) {
    next(error);
  }
};