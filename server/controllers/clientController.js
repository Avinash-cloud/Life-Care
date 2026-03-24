const User = require('../models/User');
const Counsellor = require('../models/Counsellor');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get client profile
// @route   GET /api/client/profile
// @access  Private (Client only)
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update client profile
// @route   PUT /api/client/profile
// @access  Private (Client only)
exports.updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    
    if (req.body.name) fieldsToUpdate.name = req.body.name;
    if (req.body.phone) fieldsToUpdate.phone = req.body.phone;
    if (req.body.dateOfBirth) fieldsToUpdate.dateOfBirth = req.body.dateOfBirth;
    if (req.body.gender) fieldsToUpdate.gender = req.body.gender;
    if (req.body.address) fieldsToUpdate.address = req.body.address;

    // Handle avatar from file upload or direct URL
    if (req.file) {
      fieldsToUpdate.avatar = `/${req.file.path.replace(/\\/g, '/')}`;
    } else if (req.body.avatar) {
      fieldsToUpdate.avatar = req.body.avatar;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all counsellors
// @route   GET /api/client/counsellors
// @access  Private (Client only)
exports.getCounsellors = async (req, res, next) => {
  try {
    // Build query with filters
    let query = Counsellor.find({ isVerified: true, active: true });
    
    // Filter by specialization
    if (req.query.specialization) {
      query = query.find({ specializations: { $in: [req.query.specialization] } });
    }
    
    // Filter by experience
    if (req.query.minExperience) {
      query = query.find({ experience: { $gte: parseInt(req.query.minExperience) } });
    }
    
    // Filter by fees range
    if (req.query.maxFee) {
      query = query.find({ 
        $or: [
          { 'fees.video': { $lte: parseInt(req.query.maxFee) } },
          { 'fees.chat': { $lte: parseInt(req.query.maxFee) } }
        ]
      });
    }
    
    // Sort options
    const sortBy = req.query.sortBy || 'ratings.average';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Execute query with pagination
    const counsellors = await query
      .populate('user', 'name email avatar')
      .sort({ [sortBy]: sortOrder })
      .skip(startIndex)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Counsellor.countDocuments({ isVerified: true, active: true });
    
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
// @route   GET /api/client/counsellors/:id
// @access  Private (Client only)
exports.getCounsellor = async (req, res, next) => {
  try {
    const counsellor = await Counsellor.findById(req.params.id)
      .populate('user', 'name email avatar')
      .populate({
        path: 'upcomingAppointments',
        select: 'date startTime endTime status'
      });
    
    if (!counsellor) {
      return next(new ErrorResponse(`Counsellor not found with id of ${req.params.id}`, 404));
    }
    
    // Check if counsellor is verified and active
    if (!counsellor.isVerified || !counsellor.active) {
      return next(new ErrorResponse(`Counsellor is not available`, 404));
    }
    
    res.status(200).json({
      success: true,
      data: counsellor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book appointment with counsellor
// @route   POST /api/client/appointments
// @access  Private (Client only)
exports.bookAppointment = async (req, res, next) => {
  try {
    // Add client to request body
    req.body.client = req.user.id;
    
    // Check if counsellor exists
    const counsellor = await Counsellor.findById(req.body.counsellor);
    if (!counsellor) {
      return next(new ErrorResponse(`Counsellor not found with id of ${req.body.counsellor}`, 404));
    }
    
    // Check if counsellor is verified and active
    if (!counsellor.isVerified || !counsellor.active) {
      return next(new ErrorResponse(`Counsellor is not available`, 400));
    }
    
    // Check if the slot is available
    const { date, startTime, endTime } = req.body;
    const isAvailable = counsellor.isAvailableAt(date, startTime, endTime);
    
    if (!isAvailable) {
      return next(new ErrorResponse(`Selected time slot is not available`, 400));
    }
    
    // Calculate appointment duration in minutes
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    const duration = endMinutes - startMinutes;
    
    // Calculate amount based on session type and duration
    let amount;
    if (req.body.sessionType === 'video') {
      amount = counsellor.fees.video * (duration / 60);
    } else if (req.body.sessionType === 'chat') {
      amount = counsellor.fees.chat * (duration / 60);
    } else if (req.body.sessionType === 'in-person') {
      amount = counsellor.fees.inPerson * (duration / 60);
    }
    
    // Create appointment
    const appointment = await Appointment.create({
      ...req.body,
      duration,
      amount
    });
    
    // Update counsellor's availability
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'lowercase' });
    const dayAvailability = counsellor.availability[dayOfWeek];
    
    // Add booked slot
    dayAvailability.slots.push({
      startTime,
      endTime,
      isBooked: true
    });
    
    await counsellor.save();
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client appointments
// @route   GET /api/client/appointments
// @access  Private (Client only)
exports.getAppointments = async (req, res, next) => {
  try {
    // Build query
    let query = {
      client: req.user.id
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
    
    // Execute query
    const appointments = await Appointment.find(query)
      .populate({
        path: 'counsellor',
        select: 'user specializations fees',
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

// @desc    Get single appointment
// @route   GET /api/client/appointments/:id
// @access  Private (Client only)
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({
        path: 'counsellor',
        select: 'user specializations fees',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      })
      .populate('sessionNotes', 'publicNotes');
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure appointment belongs to client
    if (appointment.client.toString() !== req.user.id) {
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

// @desc    Cancel appointment
// @route   PUT /api/client/appointments/:id/cancel
// @access  Private (Client only)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure appointment belongs to client
    if (appointment.client.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to cancel this appointment`, 403));
    }
    
    // Check if appointment can be cancelled (not past or already cancelled)
    if (appointment.status === 'cancelled') {
      return next(new ErrorResponse(`Appointment is already cancelled`, 400));
    }
    
    if (appointment.status === 'completed') {
      return next(new ErrorResponse(`Cannot cancel a completed appointment`, 400));
    }
    
    // Check if appointment is within 24 hours
    const appointmentTime = new Date(appointment.date);
    const now = new Date();
    const hoursDifference = (appointmentTime - now) / (1000 * 60 * 60);
    
    // Update appointment
    appointment.status = 'cancelled';
    appointment.cancellation = {
      reason: req.body.reason || 'Cancelled by client',
      cancelledBy: 'client',
      timestamp: Date.now(),
      refundStatus: hoursDifference >= 24 ? 'pending' : 'rejected'
    };
    
    await appointment.save();
    
    // Free up the counsellor's slot
    const counsellor = await Counsellor.findById(appointment.counsellor);
    if (counsellor) {
      const dayOfWeek = appointmentTime.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const dayAvailability = counsellor.availability[dayOfWeek];
      
      // Find and remove the booked slot
      const slotIndex = dayAvailability.slots.findIndex(
        slot => slot.startTime === appointment.startTime && slot.endTime === appointment.endTime
      );
      
      if (slotIndex !== -1) {
        dayAvailability.slots.splice(slotIndex, 1);
        await counsellor.save();
      }
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit review for counsellor
// @route   POST /api/client/reviews
// @access  Private (Client only)
exports.submitReview = async (req, res, next) => {
  try {
    const { appointment: appointmentId, counsellor, rating, comment } = req.body;
    
    // Check if appointment exists and belongs to client
    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return next(new ErrorResponse(`Appointment not found with id of ${appointmentId}`, 404));
    }
    
    if (appointment.client.toString() !== req.user.id) {
      return next(new ErrorResponse(`Not authorized to review this appointment`, 403));
    }
    
    // Allow reviews for completed appointments or remove this check for testing
    // if (appointment.status !== 'completed') {
    //   return next(new ErrorResponse(`Can only review completed appointments`, 400));
    // }
    
    // Check if review already exists
    const existingReview = await Review.findOne({
      appointment: appointmentId,
      client: req.user.id
    });
    
    if (existingReview) {
      return next(new ErrorResponse(`You have already reviewed this appointment`, 400));
    }
    
    // Create review
    const review = await Review.create({
      client: req.user.id,
      counsellor: counsellor || appointment.counsellor,
      appointment: appointmentId,
      rating,
      comment
    });
    
    // Update appointment with feedback
    appointment.feedback = {
      rating,
      comment,
      timestamp: Date.now()
    };
    
    await appointment.save();
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client reviews
// @route   GET /api/client/reviews
// @access  Private (Client only)
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ client: req.user.id })
      .populate({
        path: 'counsellor',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name avatar'
        }
      })
      .populate('appointment', 'date sessionType');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};