const User = require('../models/User');
const Counsellor = require('../models/Counsellor');
const Appointment = require('../models/Appointment');
const SessionNote = require('../models/SessionNote');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const Blog = require('../models/Blog');
const Video = require('../models/Video');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get counsellor profile
// @route   GET /api/counsellor/profile
// @access  Private (Counsellor only)
exports.getProfile = async (req, res, next) => {
  try {
    const counsellor = await Counsellor.findOne({ user: req.user.id })
      .populate('user', 'name email phone avatar isEmailVerified');
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    res.status(200).json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or update counsellor profile
// @route   PUT /api/counsellor/profile
// @access  Private (Counsellor only)
exports.updateProfile = async (req, res, next) => {
  try {
    // Find existing profile
    let counsellor = await Counsellor.findOne({ user: req.user.id });
    
    // Fields to update
    const {
      bio,
      specializations,
      qualifications,
      experience,
      languages,
      fees,
      sessionDuration,
      location,
      socialMedia,
      bankDetails
    } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (bio) profileFields.bio = bio;
    if (specializations) profileFields.specializations = specializations;
    if (qualifications) profileFields.qualifications = qualifications;
    if (experience) profileFields.experience = experience;
    if (languages) profileFields.languages = languages;
    if (fees) profileFields.fees = fees;
    if (sessionDuration) profileFields.sessionDuration = sessionDuration;
    if (location) profileFields.location = location;
    if (socialMedia) profileFields.socialMedia = socialMedia;
    if (bankDetails) profileFields.bankDetails = bankDetails;
    
    // Update user avatar if provided
    const userUpdateFields = {};
    if (req.file) {
      userUpdateFields.avatar = `/${req.file.path.replace(/\\/g, '/')}`;
    } else if (req.body.avatar) {
      userUpdateFields.avatar = req.body.avatar;
    }
    if (req.body.name) userUpdateFields.name = req.body.name;
    if (req.body.phone) userUpdateFields.phone = req.body.phone;
    
    if (Object.keys(userUpdateFields).length > 0) {
      await User.findByIdAndUpdate(req.user.id, userUpdateFields, { new: true });
    }
    
    if (counsellor) {
      // Update existing profile
      counsellor = await Counsellor.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, runValidators: true }
      ).populate('user', 'name email phone avatar');
    } else {
      // Create new profile
      profileFields.user = req.user.id;
      profileFields.name = req.user.name;
      counsellor = await Counsellor.create(profileFields);
      counsellor = await counsellor.populate('user', 'name email phone avatar');
    }
    
    res.status(200).json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update counsellor availability
// @route   PUT /api/counsellor/availability
// @access  Private (Counsellor only)
exports.updateAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;
    
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Update availability
    counsellor.availability = availability;
    await counsellor.save();
    
    res.status(200).json({
      success: true,
      data: counsellor.availability
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload verification documents
// @route   POST /api/counsellor/verification
// @access  Private (Counsellor only)
exports.uploadVerificationDocuments = async (req, res, next) => {
  try {
    // Note: In a real implementation, this would handle file uploads
    // For now, we'll just update the document URLs
    
    const { documentUrls } = req.body;
    
    if (!documentUrls || !documentUrls.length) {
      return next(new ErrorResponse('Please provide document URLs', 400));
    }
    
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Update verification documents
    counsellor.verificationDocuments = documentUrls;
    await counsellor.save();
    
    res.status(200).json({
      success: true,
      data: counsellor.verificationDocuments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get counsellor appointments
// @route   GET /api/counsellor/appointments
// @access  Private (Counsellor only)
exports.getAppointments = async (req, res, next) => {
  try {
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Build query
    let query = {
      counsellor: counsellor._id
    };
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
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
    
    // Update expired appointments to completed
    const now = new Date();
    await Appointment.updateMany({
      counsellor: counsellor._id,
      status: 'confirmed',
      date: { $lt: now }
    }, {
      status: 'completed'
    });

    // Execute query
    const appointments = await Appointment.find(query)
      .populate('client', 'name email avatar')
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

// @desc    Get single appointment
// @route   GET /api/counsellor/appointments/:id
// @access  Private (Counsellor only)
exports.getAppointment = async (req, res, next) => {
  try {
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Find appointment
    const appointment = await Appointment.findById(req.params.id)
      .populate('client', 'name email avatar phone')
      .populate({
        path: 'sessionNotes',
        select: 'publicNotes privateNotes diagnosis treatmentPlan followUpRecommended followUpDate createdAt updatedAt'
      });
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure appointment belongs to counsellor
    if (appointment.counsellor.toString() !== counsellor._id.toString()) {
      return next(new ErrorResponse(`Not authorized to access this appointment`, 403));
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status
// @route   PUT /api/counsellor/appointments/:id/status
// @access  Private (Counsellor only)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return next(new ErrorResponse('Please provide a status', 400));
    }
    
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Find appointment
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure appointment belongs to counsellor
    if (appointment.counsellor.toString() !== counsellor._id.toString()) {
      return next(new ErrorResponse(`Not authorized to update this appointment`, 403));
    }
    
    // Update status
    appointment.status = status;
    
    // If cancelling, add cancellation details
    if (status === 'cancelled') {
      appointment.cancellation = {
        reason: req.body.reason || 'Cancelled by counsellor',
        cancelledBy: 'counsellor',
        timestamp: Date.now(),
        refundStatus: 'pending'
      };
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

// @desc    Add session notes
// @route   POST /api/counsellor/appointments/:id/notes
// @access  Private (Counsellor only)
exports.addSessionNotes = async (req, res, next) => {
  try {
    const { privateNotes, publicNotes, diagnosis, treatmentPlan, followUpRecommended, followUpDate } = req.body;
    
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Find appointment
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure appointment belongs to counsellor
    if (appointment.counsellor.toString() !== counsellor._id.toString()) {
      return next(new ErrorResponse(`Not authorized to add notes to this appointment`, 403));
    }
    
    // Check if notes already exist
    let sessionNote = await SessionNote.findOne({ appointment: req.params.id });
    
    if (sessionNote) {
      // Update existing notes
      sessionNote.privateNotes = privateNotes || sessionNote.privateNotes;
      sessionNote.publicNotes = publicNotes || sessionNote.publicNotes;
      sessionNote.diagnosis = diagnosis || sessionNote.diagnosis;
      sessionNote.treatmentPlan = treatmentPlan || sessionNote.treatmentPlan;
      
      if (followUpRecommended !== undefined) {
        sessionNote.followUpRecommended = followUpRecommended;
      }
      
      if (followUpDate) {
        sessionNote.followUpDate = followUpDate;
      }
      
      await sessionNote.save();
    } else {
      // Create new notes
      sessionNote = await SessionNote.create({
        appointment: req.params.id,
        counsellor: counsellor._id,
        client: appointment.client,
        privateNotes,
        publicNotes,
        diagnosis,
        treatmentPlan,
        followUpRecommended: followUpRecommended || false,
        followUpDate
      });
    }
    
    res.status(200).json({
      success: true,
      data: sessionNote
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get counsellor earnings
// @route   GET /api/counsellor/earnings
// @access  Private (Counsellor only)
exports.getEarnings = async (req, res, next) => {
  try {
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Get completed appointments with payment details
    const completedAppointments = await Appointment.find({
      counsellor: counsellor._id,
      status: 'completed',
      'payment.status': 'completed'
    }).populate('client', 'name').sort({ date: -1 });
    
    // Calculate earnings from payment breakdown
    let totalEarnings = 0;
    let totalPlatformFees = 0;
    
    completedAppointments.forEach(appointment => {
      if (appointment.payment.counsellorAmount) {
        totalEarnings += appointment.payment.counsellorAmount;
        totalPlatformFees += appointment.payment.platformFee;
      } else {
        // Fallback for old appointments without breakdown
        totalEarnings += appointment.amount;
      }
    });
    
    // Get withdrawal requests
    const withdrawalRequests = await WithdrawalRequest.find({
      counsellor: counsellor._id
    }).sort({ createdAt: -1 });
    
    // Calculate withdrawn amount
    let withdrawnAmount = 0;
    withdrawalRequests.forEach(request => {
      if (request.status === 'processed') {
        withdrawnAmount += request.amount;
      }
    });
    
    // Calculate pending amount
    const pendingAmount = totalEarnings - withdrawnAmount;
    
    // Update counsellor earnings in database
    counsellor.earnings = {
      total: totalEarnings,
      withdrawn: withdrawnAmount,
      pending: pendingAmount
    };
    
    await counsellor.save();
    
    res.status(200).json({
      success: true,
      data: {
        earnings: counsellor.earnings,
        totalPlatformFees,
        completedAppointments: completedAppointments.slice(0, 10), // Recent 10
        withdrawalRequests
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Request withdrawal
// @route   POST /api/counsellor/withdrawals
// @access  Private (Counsellor only)
exports.requestWithdrawal = async (req, res, next) => {
  try {
    const { amount, bankDetails } = req.body;
    
    if (!amount || amount < 100) {
      return next(new ErrorResponse('Minimum withdrawal amount is 100', 400));
    }
    
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Check if counsellor has enough balance
    if (counsellor.earnings.pending < amount) {
      return next(new ErrorResponse('Insufficient balance', 400));
    }
    
    // Use counsellor's bank details if not provided
    const withdrawalBankDetails = bankDetails || counsellor.bankDetails;
    
    if (!withdrawalBankDetails || !withdrawalBankDetails.accountNumber || !withdrawalBankDetails.bankName) {
      return next(new ErrorResponse('Please provide bank details', 400));
    }
    
    // Create withdrawal request
    const withdrawalRequest = await WithdrawalRequest.create({
      counsellor: counsellor._id,
      amount,
      bankDetails: withdrawalBankDetails
    });
    
    res.status(201).json({
      success: true,
      data: withdrawalRequest
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog post
// @route   POST /api/counsellor/blogs
// @access  Private (Counsellor only)
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, summary, featuredImage, categories, tags, status } = req.body;
    
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Create blog
    const blog = await Blog.create({
      title,
      content,
      summary,
      featuredImage,
      author: req.user.id,
      categories,
      tags,
      status: status || 'draft'
    });
    
    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload video
// @route   POST /api/counsellor/videos
// @access  Private (Counsellor only)
exports.uploadVideo = async (req, res, next) => {
  try {
    const { title, description, videoUrl, videoType, thumbnailUrl, categories, tags, status } = req.body;
    
    // Find counsellor
    const counsellor = await Counsellor.findOne({ user: req.user.id });
    
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor profile not found', 404));
    }
    
    // Create video
    const video = await Video.create({
      title,
      description,
      videoUrl,
      videoType,
      thumbnailUrl,
      author: req.user.id,
      categories,
      tags,
      status: status || 'draft'
    });
    
    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};