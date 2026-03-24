const PostSessionAttachment = require('../models/PostSessionAttachment');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const fs = require('fs');

// @desc    Create post-session attachment
// @route   POST /api/counsellor/appointments/:appointmentId/attachments
// @access  Private (Psychiatrist/Psychologist only)
exports.createAttachment = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;
    const { title, description, attachmentType, content, category } = req.body;

    // Verify appointment exists and belongs to counsellor
    const appointment = await Appointment.findById(appointmentId).populate('counsellor');
    
    if (!appointment) {
      return next(new ErrorResponse('Appointment not found', 404));
    }

    if (appointment.counsellor.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to add attachments to this appointment', 403));
    }

    if (appointment.status !== 'completed') {
      return next(new ErrorResponse('Can only add attachments to completed appointments', 400));
    }

    // Check if user is psychiatrist or psychologist
    if (!['psychiatrist', 'psychologist'].includes(req.user.counsellorType)) {
      return next(new ErrorResponse('Only psychiatrists and psychologists can create post-session attachments', 403));
    }

    const attachmentData = {
      appointment: appointmentId,
      counsellor: req.user.id,
      client: appointment.client,
      title,
      description,
      attachmentType,
      category: category || 'general'
    };

    // Handle different attachment types
    if (attachmentType === 'text') {
      attachmentData.content = { text: content.text };
    } else if (attachmentType === 'image' || attachmentType === 'document') {
      // File should be uploaded via separate upload endpoint
      if (!content.fileUrl || !content.fileName) {
        return next(new ErrorResponse('File URL and name are required for file attachments', 400));
      }
      attachmentData.content = {
        fileUrl: content.fileUrl,
        fileName: content.fileName,
        fileSize: content.fileSize,
        mimeType: content.mimeType
      };
    }

    const attachment = await PostSessionAttachment.create(attachmentData);
    await attachment.populate(['counsellor', 'client']);

    res.status(201).json({
      success: true,
      data: attachment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attachments for an appointment
// @route   GET /api/counsellor/appointments/:appointmentId/attachments
// @access  Private (Counsellor only)
exports.getAppointmentAttachments = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    // Verify appointment exists and belongs to counsellor
    const appointment = await Appointment.findById(appointmentId).populate('counsellor');
    
    if (!appointment) {
      return next(new ErrorResponse('Appointment not found', 404));
    }

    if (appointment.counsellor.user.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to view attachments for this appointment', 403));
    }

    const attachments = await PostSessionAttachment.find({ 
      appointment: appointmentId,
      isVisible: true 
    }).populate(['counsellor', 'client']).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attachments.length,
      data: attachments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get client's attachments
// @route   GET /api/client/attachments
// @access  Private (Client only)
exports.getClientAttachments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const attachments = await PostSessionAttachment.find({ 
      client: req.user.id,
      isVisible: true 
    })
    .populate([
      {
        path: 'counsellor',
        select: 'name email counsellorType avatar'
      },
      {
        path: 'appointment',
        select: 'date sessionType'
      }
    ])
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip(startIndex);

    const total = await PostSessionAttachment.countDocuments({ 
      client: req.user.id,
      isVisible: true 
    });

    res.status(200).json({
      success: true,
      count: attachments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: attachments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single attachment
// @route   GET /api/client/attachments/:id
// @access  Private (Client only)
exports.getAttachment = async (req, res, next) => {
  try {
    const attachment = await PostSessionAttachment.findById(req.params.id)
      .populate([
        {
          path: 'counsellor',
          select: 'name email counsellorType avatar'
        },
        {
          path: 'appointment',
          select: 'date sessionType'
        }
      ]);

    if (!attachment) {
      return next(new ErrorResponse('Attachment not found', 404));
    }

    // Check if client owns this attachment
    if (attachment.client.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to view this attachment', 403));
    }

    if (!attachment.isVisible) {
      return next(new ErrorResponse('Attachment not available', 404));
    }

    res.status(200).json({
      success: true,
      data: attachment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update attachment
// @route   PUT /api/counsellor/attachments/:id
// @access  Private (Psychiatrist/Psychologist only)
exports.updateAttachment = async (req, res, next) => {
  try {
    let attachment = await PostSessionAttachment.findById(req.params.id);

    if (!attachment) {
      return next(new ErrorResponse('Attachment not found', 404));
    }

    // Check if counsellor owns this attachment
    if (attachment.counsellor.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to update this attachment', 403));
    }

    const { title, description, category, isVisible } = req.body;
    
    attachment = await PostSessionAttachment.findByIdAndUpdate(
      req.params.id,
      { title, description, category, isVisible },
      { new: true, runValidators: true }
    ).populate(['counsellor', 'client']);

    res.status(200).json({
      success: true,
      data: attachment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete attachment
// @route   DELETE /api/counsellor/attachments/:id
// @access  Private (Psychiatrist/Psychologist only)
exports.deleteAttachment = async (req, res, next) => {
  try {
    const attachment = await PostSessionAttachment.findById(req.params.id);

    if (!attachment) {
      return next(new ErrorResponse('Attachment not found', 404));
    }

    // Check if counsellor owns this attachment
    if (attachment.counsellor.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to delete this attachment', 403));
    }

    // Delete file if it exists
    if (attachment.content.fileUrl) {
      const filePath = path.join(__dirname, '..', attachment.content.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await attachment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};