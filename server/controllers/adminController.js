const User = require('../models/User');
const Counsellor = require('../models/Counsellor');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const Blog = require('../models/Blog');
const Video = require('../models/Video');
const GalleryImage = require('../models/GalleryImage');
const ErrorResponse = require('../utils/errorResponse');
const CallbackRequest = require('../models/CallbackRequest');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    // Build query
    let query = {};
    
    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Filter by active status
    if (req.query.active !== undefined) {
      query.active = req.query.active === 'true';
    }
    
    // Filter by email verification status
    if (req.query.isEmailVerified !== undefined) {
      query.isEmailVerified = req.query.isEmailVerified === 'true';
    }
    
    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const users = await User.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: users.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private (Admin only)
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Only allow creating client and counsellor accounts
    if (role && !['client', 'counsellor'].includes(role)) {
      return next(new ErrorResponse('Only client and counsellor accounts can be created', 400));
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400));
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client', // Default to client if no role specified
      isEmailVerified: true // Admin-created users are automatically verified
    });
    
    res.status(201).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res, next) => {
  try {
    const { name, email, role, active, avatar, password } = req.body;
    
    console.log('Admin updateUser received:', { name, email, role, active, avatar, password: password ? '[HIDDEN]' : undefined });
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (active !== undefined) updateFields.active = active === 'true' || active === true;
    
    // Handle avatar from FormData or direct URL
    if (req.file) {
      updateFields.avatar = `/${req.file.path.replace(/\\/g, '/')}`;
      console.log('Admin avatar file upload:', updateFields.avatar);
    } else if (avatar) {
      updateFields.avatar = avatar;
      console.log('Admin avatar URL update:', updateFields.avatar);
    }
    
    // Handle password update - only if provided and not empty
    if (password && password.trim() !== '') {
      updateFields.password = password;
      console.log('Password will be updated');
    }
    
    console.log('Admin updating user with fields:', updateFields);
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    console.log('User updated successfully:', user.avatar);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Admin updateUser error:', error);
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is an admin
    if (user.role === 'admin') {
      return next(new ErrorResponse('Cannot delete admin user', 403));
    }
    
    // Delete user
    await User.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all counsellors
// @route   GET /api/admin/counsellors
// @access  Private (Admin only)
exports.getCounsellors = async (req, res, next) => {
  try {
    // Build query
    let query = {};
    
    // Filter by verification status
    if (req.query.isVerified !== undefined) {
      query.isVerified = req.query.isVerified === 'true';
    }
    
    // Filter by active status
    if (req.query.active !== undefined) {
      query.active = req.query.active === 'true';
    }
    
    // Search by name or specialization
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { specializations: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const counsellors = await Counsellor.find(query)
      .populate('user', 'name email avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Counsellor.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: counsellors.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: counsellors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single counsellor
// @route   GET /api/admin/counsellors/:id
// @access  Private (Admin only)
exports.getCounsellor = async (req, res, next) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id)
      .populate('user', 'name email avatar phone isEmailVerified active');
    
    if (!counsellor) {
      return next(new ErrorResponse(`Counsellor not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create counsellor with profile
// @route   POST /api/admin/counsellors
// @access  Private (Admin only)
exports.createCounsellor = async (req, res, next) => {
  try {
    const { 
      name, email, password, phone, profilePicture, counsellorType,
      specializations, experience, qualifications, 
      bio, fees, languages, gender, dateOfBirth,
      address, city, state, pincode
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400));
    }
    
    // Create user first
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'counsellor',
      counsellorType: counsellorType || 'counsellor',
      avatar: profilePicture,
      isEmailVerified: true // Admin-created users are automatically verified
    });
    
    try {
      // Clean qualifications - remove empty certificate fields
      const cleanedQualifications = qualifications ? qualifications.map(qual => {
        const cleaned = {
          degree: qual.degree,
          institution: qual.institution,
          year: parseInt(qual.year) || new Date().getFullYear()
        };
        // Only add certificate if it's not empty
        if (qual.certificate && qual.certificate.trim() !== '') {
          cleaned.certificate = qual.certificate;
        }
        return cleaned;
      }) : [];
      
      // Build location object if address fields are provided
      const location = {};
      if (address && address.trim()) location.address = address;
      if (city && city.trim()) location.city = city;
      if (state && state.trim()) location.state = state;
      if (pincode && pincode.trim()) location.postalCode = pincode;
      
      // Create counsellor profile
      const counsellorData = {
        user: user._id,
        specializations: Array.isArray(specializations) ? specializations : (specializations ? specializations.split(',').map(s => s.trim()) : []),
        experience: parseInt(experience) || 0,
        qualifications: cleanedQualifications,
        bio,
        fees: fees || { video: 0, chat: 0 },
        languages: Array.isArray(languages) ? languages : (languages ? languages.split(',').map(l => l.trim()) : []),
        isVerified: true // Admin-created counsellors are automatically verified
      };
      
      // Add location if any fields are present
      if (Object.keys(location).length > 0) {
        counsellorData.location = location;
      }
      
      const counsellor = await Counsellor.create(counsellorData);
      
      res.status(201).json({
        success: true,
        data: counsellor
      });
    } catch (counsellorError) {
      // If counsellor creation fails, delete the user to maintain consistency
      await User.findByIdAndDelete(user._id);
      throw counsellorError;
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update counsellor
// @route   PUT /api/admin/counsellors/:id
// @access  Private (Admin only)
exports.updateCounsellor = async (req, res, next) => {
  try {
    const { 
      specializations, experience, qualifications, 
      bio, fees, languages, isVerified, gender,
      dateOfBirth, address, city, state, pincode
    } = req.body;
    
    const updateFields = {};
    if (specializations) updateFields.specializations = Array.isArray(specializations) ? specializations : specializations.split(',').map(s => s.trim());
    if (experience !== undefined) updateFields.experience = parseInt(experience) || 0;
    
    // Clean qualifications - remove empty certificate fields
    if (qualifications) {
      updateFields.qualifications = qualifications.map(qual => {
        const cleaned = {
          degree: qual.degree,
          institution: qual.institution,
          year: parseInt(qual.year) || new Date().getFullYear()
        };
        // Only add certificate if it's not empty
        if (qual.certificate && qual.certificate.trim() !== '') {
          cleaned.certificate = qual.certificate;
        }
        return cleaned;
      });
    }
    
    if (bio) updateFields.bio = bio;
    if (fees) updateFields.fees = fees;
    if (languages) updateFields.languages = Array.isArray(languages) ? languages : languages.split(',').map(l => l.trim());
    if (isVerified !== undefined) updateFields.isVerified = isVerified;
    
    // Build location object if address fields are provided
    if (address || city || state || pincode) {
      updateFields.location = {};
      if (address && address.trim()) updateFields.location.address = address;
      if (city && city.trim()) updateFields.location.city = city;
      if (state && state.trim()) updateFields.location.state = state;
      if (pincode && pincode.trim()) updateFields.location.postalCode = pincode;
    }
    
    const counsellor = await Counsellor.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar phone');
    
    if (!counsellor) {
      return next(new ErrorResponse(`Counsellor not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete counsellor
// @route   DELETE /api/admin/counsellors/:id
// @access  Private (Admin only)
exports.deleteCounsellor = async (req, res, next) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id);
    
    if (!counsellor) {
      return next(new ErrorResponse(`Counsellor not found with id of ${req.params.id}`, 404));
    }
    
    // Delete counsellor profile
    await Counsellor.findByIdAndDelete(req.params.id);
    
    // Delete associated user
    await User.findByIdAndDelete(counsellor.user);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update counsellor verification status
// @route   PUT /api/admin/counsellors/:id/verify
// @access  Private (Admin only)
exports.verifyCounsellor = async (req, res, next) => {
  try {
    const { isVerified } = req.body;
    
    if (isVerified === undefined) {
      return next(new ErrorResponse('Please provide verification status', 400));
    }
    
    const counsellor = await Counsellor.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    );
    
    if (!counsellor) {
      return next(new ErrorResponse(`Counsellor not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin only)
exports.getAppointments = async (req, res, next) => {
  try {
    // Build query
    let query = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by payment status
    if (req.query.paymentStatus) {
      query['payment.status'] = req.query.paymentStatus;
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.date = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    } else if (req.query.startDate) {
      query.date = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.date = { $lte: new Date(req.query.endDate) };
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const appointments = await Appointment.find(query)
      .populate('client', 'name email avatar')
      .populate({
        path: 'counsellor',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      })
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await Appointment.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment payment status
// @route   PUT /api/admin/appointments/:id/payment
// @access  Private (Admin only)
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { status, method, id } = req.body;
    
    if (!status) {
      return next(new ErrorResponse('Please provide payment status', 400));
    }
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }
    
    // Update payment details
    appointment.payment = {
      status,
      method: method || appointment.payment?.method,
      id: id || appointment.payment?.id,
      timestamp: Date.now()
    };
    
    // If payment is completed, update counsellor earnings
    if (status === 'completed' && appointment.status === 'completed') {
      const counsellor = await Counsellor.findById(appointment.counsellor);
      
      if (counsellor) {
        counsellor.earnings.total += appointment.amount;
        counsellor.earnings.pending += appointment.amount;
        await counsellor.save();
      }
    }
    
    // If payment is refunded, update counsellor earnings
    if (status === 'refunded') {
      const counsellor = await Counsellor.findById(appointment.counsellor);
      
      if (counsellor) {
        counsellor.earnings.total -= appointment.amount;
        counsellor.earnings.pending -= appointment.amount;
        await counsellor.save();
      }
      
      // Update cancellation refund status
      if (appointment.cancellation) {
        appointment.cancellation.refundStatus = 'processed';
      }
    }
    
    await appointment.save();
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process withdrawal request
// @route   PUT /api/admin/withdrawals/:id
// @access  Private (Admin only)
exports.processWithdrawal = async (req, res, next) => {
  try {
    const { status, transactionId, rejectionReason } = req.body;
    
    if (!status) {
      return next(new ErrorResponse('Please provide status', 400));
    }
    
    const withdrawal = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawal) {
      return next(new ErrorResponse(`Withdrawal request not found with id of ${req.params.id}`, 404));
    }
    
    // Update withdrawal request
    withdrawal.status = status;
    withdrawal.processedBy = req.user.id;
    withdrawal.processedAt = Date.now();
    
    if (status === 'processed') {
      if (!transactionId) {
        return next(new ErrorResponse('Please provide transaction ID', 400));
      }
      withdrawal.transactionId = transactionId;
    } else if (status === 'rejected') {
      if (!rejectionReason) {
        return next(new ErrorResponse('Please provide rejection reason', 400));
      }
      withdrawal.rejectionReason = rejectionReason;
    }
    
    await withdrawal.save();
    
    // If processed, update counsellor earnings
    if (status === 'processed') {
      const counsellor = await Counsellor.findById(withdrawal.counsellor);
      
      if (counsellor) {
        counsellor.earnings.withdrawn += withdrawal.amount;
        counsellor.earnings.pending -= withdrawal.amount;
        await counsellor.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: withdrawal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all withdrawal requests
// @route   GET /api/admin/withdrawals
// @access  Private (Admin only)
exports.getWithdrawals = async (req, res, next) => {
  try {
    // Build query
    let query = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const withdrawals = await WithdrawalRequest.find(query)
      .populate({
        path: 'counsellor',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('processedBy', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count
    const total = await WithdrawalRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: withdrawals.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: withdrawals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manage CMS content (blogs, videos, gallery)
// @route   GET /api/admin/cms/blogs
// @access  Private (Admin only)
exports.getBlogs = async (req, res, next) => {
  try {
    // Build query
    let query = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by featured
    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === 'true';
    }
    
    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
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
// @route   GET /api/admin/cms/blogs/:id
// @access  Private (Admin only)
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name avatar');
    
    if (!blog) {
      return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/admin/cms/blogs
// @access  Private (Admin only)
exports.createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    
    // Handle featured image upload
    if (req.file) {
      req.body.featuredImage = `/${req.file.path.replace(/\\/g, '/')}`;
    }
    
    const blog = await Blog.create(req.body);
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/admin/cms/blogs/:id
// @access  Private (Admin only)
exports.updateBlog = async (req, res, next) => {
  try {
    // Handle featured image upload
    if (req.file) {
      req.body.featuredImage = `/${req.file.path.replace(/\\/g, '/')}`;
    }
    
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/admin/cms/blogs/:id
// @access  Private (Admin only)
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return next(new ErrorResponse(`Blog not found with id of ${req.params.id}`, 404));
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all videos
// @route   GET /api/admin/cms/videos
// @access  Private (Admin only)
exports.getVideos = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.isFeatured !== undefined) {
      query.isFeatured = req.query.isFeatured === 'true';
    }
    
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const videos = await Video.find(query)
      .populate('author', 'name avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
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

// @desc    Create video
// @route   POST /api/admin/cms/videos
// @access  Private (Admin only)
exports.createVideo = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    if (!req.body.status) req.body.status = 'published';
    const video = await Video.create(req.body);
    
    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update video
// @route   PUT /api/admin/cms/videos/:id
// @access  Private (Admin only)
exports.updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!video) {
      return next(new ErrorResponse(`Video not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/admin/cms/videos/:id
// @access  Private (Admin only)
exports.deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return next(new ErrorResponse(`Video not found with id of ${req.params.id}`, 404));
    }
    
    // Delete file from filesystem
    if (video.videoUrl) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', video.videoUrl.replace(/^\//,''));
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Video.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gallery images
// @route   GET /api/admin/cms/gallery
// @access  Private (Admin only)
exports.getGallery = async (req, res, next) => {
  try {
    let query = {};
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const startIndex = (page - 1) * limit;
    
    const images = await GalleryImage.find(query)
      .populate('uploadedBy', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    const total = await GalleryImage.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: images.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: images
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload gallery image
// @route   POST /api/admin/cms/gallery
// @access  Private (Admin only)
exports.uploadGalleryImage = async (req, res, next) => {
  try {
    req.body.uploadedBy = req.user.id;
    const image = await GalleryImage.create(req.body);
    
    res.status(201).json({
      success: true,
      data: image
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/admin/cms/gallery/:id
// @access  Private (Admin only)
exports.deleteGalleryImage = async (req, res, next) => {
  try {
    const image = await GalleryImage.findById(req.params.id);
    
    if (!image) {
      return next(new ErrorResponse(`Image not found with id of ${req.params.id}`, 404));
    }
    
    // Delete file from filesystem
    if (image.imageUrl) {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, '..', image.imageUrl.replace(/^\//,''));
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await GalleryImage.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics/reports
// @route   GET /api/admin/reports
// @access  Private (Admin only)
exports.getReports = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }
    
    let reportData = {};
    
    switch (type) {
      case 'users':
        reportData = await generateUserReport(dateFilter);
        break;
      case 'appointments':
        reportData = await generateAppointmentReport(dateFilter);
        break;
      case 'revenue':
        reportData = await generateRevenueReport(dateFilter);
        break;
      case 'content':
        reportData = await generateContentReport(dateFilter);
        break;
      default:
        reportData = await generateOverallReport(dateFilter);
    }
    
    res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions for reports
const generateUserReport = async (dateFilter) => {
  const totalUsers = await User.countDocuments(dateFilter);
  const newUsers = await User.countDocuments({ ...dateFilter, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } });
  const activeUsers = await User.countDocuments({ ...dateFilter, active: true });
  const usersByRole = await User.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);
  
  return {
    totalUsers,
    newUsers,
    activeUsers,
    usersByRole
  };
};

const generateAppointmentReport = async (dateFilter) => {
  const totalAppointments = await Appointment.countDocuments(dateFilter);
  const appointmentsByStatus = await Appointment.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  const appointmentsByMonth = await Appointment.aggregate([
    { $match: dateFilter },
    { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } }
  ]);
  
  return {
    totalAppointments,
    appointmentsByStatus,
    appointmentsByMonth
  };
};

const generateRevenueReport = async (dateFilter) => {
  const revenueData = await Appointment.aggregate([
    { $match: { ...dateFilter, 'payment.status': 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        averageAmount: { $avg: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  const monthlyRevenue = await Appointment.aggregate([
    { $match: { ...dateFilter, 'payment.status': 'completed' } },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);
  
  return {
    ...revenueData[0],
    monthlyRevenue
  };
};

const generateContentReport = async (dateFilter) => {
  const blogStats = await Blog.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const videoStats = await Video.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
  
  const galleryStats = await GalleryImage.countDocuments(dateFilter);
  
  return {
    blogStats,
    videoStats,
    galleryStats
  };
};

const generateOverallReport = async (dateFilter) => {
  const userReport = await generateUserReport(dateFilter);
  const appointmentReport = await generateAppointmentReport(dateFilter);
  const revenueReport = await generateRevenueReport(dateFilter);
  const contentReport = await generateContentReport(dateFilter);
  
  return {
    users: userReport,
    appointments: appointmentReport,
    revenue: revenueReport,
    content: contentReport
  };
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get user counts
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalCounsellors = await User.countDocuments({ role: 'counsellor' });
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    });
    
    // Get appointment counts
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    const todayAppointments = await Appointment.countDocuments({
      date: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        $lt: new Date(new Date().setHours(23, 59, 59, 999))
      }
    });
    
    // Get payment stats
    const completedPayments = await Appointment.find({
      'payment.status': 'completed'
    });
    
    let totalRevenue = 0;
    completedPayments.forEach(appointment => {
      totalRevenue += appointment.amount;
    });
    
    // Get pending withdrawals
    const pendingWithdrawals = await WithdrawalRequest.countDocuments({ status: 'pending' });
    const pendingWithdrawalAmount = await WithdrawalRequest.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get content stats
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const totalVideos = await Video.countDocuments();
    const publishedVideos = await Video.countDocuments({ status: 'published' });
    const totalGalleryImages = await GalleryImage.countDocuments();
    
    // Get counsellor verification stats
    const pendingCounsellors = await Counsellor.countDocuments({ isVerified: false });
    const verifiedCounsellors = await Counsellor.countDocuments({ isVerified: true });
    
    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');
    
    const recentAppointments = await Appointment.find()
      .populate('client', 'name')
      .populate({
        path: 'counsellor',
        populate: { path: 'user', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          clients: totalClients,
          counsellors: totalCounsellors,
          newThisMonth: newUsersThisMonth
        },
        appointments: {
          total: totalAppointments,
          pending: pendingAppointments,
          completed: completedAppointments,
          today: todayAppointments
        },
        finances: {
          totalRevenue,
          pendingWithdrawals,
          pendingWithdrawalAmount: pendingWithdrawalAmount[0]?.total || 0
        },
        content: {
          blogs: totalBlogs,
          publishedBlogs,
          videos: totalVideos,
          publishedVideos,
          galleryImages: totalGalleryImages
        },
        counsellors: {
          pending: pendingCounsellors,
          verified: verifiedCounsellors
        },
        recentActivity: {
          users: recentUsers,
          appointments: recentAppointments
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private (Admin only)
exports.getSettings = async (req, res, next) => {
  try {
    // This would typically come from a Settings model
    // For now, return default settings
    const settings = {
      platform: {
        name: 'S S Psychologist Life Care',
        description: 'Mental Health Support Platform',
        logo: '/assets/logo.png',
        favicon: '/assets/favicon.ico',
        primaryColor: '#2563eb',
        secondaryColor: '#10b981'
      },
      email: {
        smtpHost: process.env.SMTP_HOST || '',
        smtpPort: process.env.SMTP_PORT || 587,
        smtpUser: process.env.SMTP_EMAIL || '',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@lifecare.com'
      },
      payment: {
        razorpayEnabled: !!process.env.RAZORPAY_KEY_ID,
        stripeEnabled: !!process.env.STRIPE_PUBLISHABLE_KEY,
        currency: 'INR',
        taxRate: 18
      },
      features: {
        videoCallEnabled: true,
        chatEnabled: true,
        blogEnabled: true,
        galleryEnabled: true,
        reviewsEnabled: true
      }
    };
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res, next) => {
  try {
    // In a real application, you would save these to a Settings model
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: req.body
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Private (Admin only)
exports.banUser = async (req, res, next) => {
  try {
    const { banned, reason } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        active: !banned,
        banReason: banned ? reason : undefined
      },
      { new: true }
    );
    
    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Handle dispute
// @route   PUT /api/admin/disputes/:id
// @access  Private (Admin only)
exports.handleDispute = async (req, res, next) => {
  try {
    const { status, resolution, refundAmount } = req.body;
    
    // Find the appointment related to the dispute
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }
    
    // Update dispute status
    appointment.dispute = {
      status,
      resolution,
      resolvedBy: req.user.id,
      resolvedAt: Date.now()
    };
    
    // Handle refund if applicable
    if (refundAmount && refundAmount > 0) {
      appointment.payment.status = 'refunded';
      appointment.payment.refundAmount = refundAmount;
    }
    
    await appointment.save();
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all callback requests
// @route   GET /api/admin/callbacks
// @access  Private (Admin only)
exports.getCallbackRequests = async (req, res, next) => {
  try {
    let query = {};
    if (req.query.status) query.status = req.query.status;
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const callbacks = await CallbackRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    const total = await CallbackRequest.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: callbacks.length,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      data: callbacks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update callback request
// @route   PUT /api/admin/callbacks/:id
// @access  Private (Admin only)
exports.updateCallbackRequest = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const callback = await CallbackRequest.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true, runValidators: true }
    );
    
    if (!callback) {
      return next(new ErrorResponse(`Callback request not found with id of ${req.params.id}`, 404));
    }
    
    res.status(200).json({ success: true, data: callback });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete callback request
// @route   DELETE /api/admin/callbacks/:id
// @access  Private (Admin only)
exports.deleteCallbackRequest = async (req, res, next) => {
  try {
    const callback = await CallbackRequest.findById(req.params.id);
    if (!callback) {
      return next(new ErrorResponse(`Callback request not found with id of ${req.params.id}`, 404));
    }
    await CallbackRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
