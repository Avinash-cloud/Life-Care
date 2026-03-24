const Appointment = require('../models/Appointment');
const PaymentSettings = require('../models/PaymentSettings');
const Counsellor = require('../models/Counsellor');
const ErrorResponse = require('../utils/errorResponse');
const PDFDocument = require('pdfkit');

// @desc    Get payment settings
// @route   GET /api/admin/payment-settings
// @access  Private (Admin)
exports.getPaymentSettings = async (req, res, next) => {
  try {
    let settings = await PaymentSettings.findOne().populate('counsellorMargins.counsellor');
    
    if (!settings) {
      settings = await PaymentSettings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment settings
// @route   PUT /api/admin/payment-settings
// @access  Private (Admin)
exports.updatePaymentSettings = async (req, res, next) => {
  try {
    const { globalMargin, counsellorMargins } = req.body;

    let settings = await PaymentSettings.findOne();
    
    if (!settings) {
      settings = new PaymentSettings();
    }

    if (globalMargin !== undefined) {
      settings.globalMargin = globalMargin;
    }

    if (counsellorMargins) {
      settings.counsellorMargins = counsellorMargins;
    }

    await settings.save();
    await settings.populate('counsellorMargins.counsellor');

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate payment breakdown
// @route   POST /api/payments/calculate
// @access  Private
exports.calculatePayment = async (req, res, next) => {
  try {
    const { counsellorId, amount } = req.body;

    const settings = await PaymentSettings.findOne();
    const counsellor = await Counsellor.findById(counsellorId);

    if (!counsellor) {
      return next(new ErrorResponse('Counsellor not found', 404));
    }

    // Get margin for this counsellor or use global margin
    let marginPercentage = settings?.globalMargin || 20;
    
    if (settings?.counsellorMargins) {
      const customMargin = settings.counsellorMargins.find(
        cm => cm.counsellor.toString() === counsellorId
      );
      if (customMargin) {
        marginPercentage = customMargin.margin;
      }
    }

    const platformFee = (amount * marginPercentage) / 100;
    const counsellorAmount = amount - platformFee;

    res.status(200).json({
      success: true,
      data: {
        totalAmount: amount,
        platformFee,
        counsellorAmount,
        marginPercentage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process payment
// @route   POST /api/payments/process
// @access  Private
exports.processPayment = async (req, res, next) => {
  try {
    const { appointmentId, paymentMethod } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate('counsellor')
      .populate('client');

    if (!appointment) {
      return next(new ErrorResponse('Appointment not found', 404));
    }

    // Calculate payment breakdown
    const settings = await PaymentSettings.findOne();
    let marginPercentage = settings?.globalMargin || 20;
    
    if (settings?.counsellorMargins) {
      const customMargin = settings.counsellorMargins.find(
        cm => cm.counsellor._id.toString() === appointment.counsellor._id.toString()
      );
      if (customMargin) {
        marginPercentage = customMargin.margin;
      }
    }

    const totalAmount = appointment.amount;
    const platformFee = (totalAmount * marginPercentage) / 100;
    const counsellorAmount = totalAmount - platformFee;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${appointment._id.toString().slice(-6)}`;

    // Update appointment with payment details
    appointment.payment = {
      status: 'completed',
      method: paymentMethod,
      timestamp: new Date(),
      totalAmount,
      platformFee,
      counsellorAmount,
      marginPercentage,
      invoiceNumber
    };

    await appointment.save();

    // Update counsellor earnings
    const counsellor = await Counsellor.findById(appointment.counsellor._id);
    counsellor.earnings.total += counsellorAmount;
    counsellor.earnings.pending += counsellorAmount;
    await counsellor.save();

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate invoice PDF
// @route   GET /api/payments/invoice/:appointmentId
// @access  Private
exports.generateInvoice = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId)
      .populate('client', 'name email')
      .populate('counsellor')
      .populate({
        path: 'counsellor',
        populate: {
          path: 'user',
          select: 'name email'
        }
      });

    if (!appointment) {
      return next(new ErrorResponse('Appointment not found', 404));
    }

    if (appointment.client._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this invoice', 403));
    }

    if (!appointment.payment || appointment.payment.status !== 'completed') {
      return next(new ErrorResponse('Payment not completed', 400));
    }

    // Use amount if totalAmount not available (legacy appointments)
    const totalAmount = appointment.payment.totalAmount || appointment.amount || 0;
    const platformFee = appointment.payment.platformFee || 0;
    const marginPercentage = appointment.payment.marginPercentage || 0;

    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${appointment.payment.invoiceNumber}.pdf`);
    
    doc.pipe(res);

    // Header with logo area
    doc.fontSize(24).fillColor('#2563eb').text('S S PSYCHOLOGIST LIFE CARE', 50, 50);
    doc.fontSize(12).fillColor('#666').text('Mental Health & Wellness Services', 50, 80);
    
    // Invoice title
    doc.fontSize(28).fillColor('#000').text('INVOICE', 400, 50);
    doc.fontSize(12).fillColor('#666').text(`#${appointment.payment.invoiceNumber}`, 400, 85);
    
    // Line separator
    doc.moveTo(50, 120).lineTo(550, 120).stroke('#e5e7eb');
    
    // Invoice details section
    doc.fontSize(14).fillColor('#000').text('Invoice Details', 50, 140);
    doc.fontSize(11).fillColor('#666')
       .text(`Invoice Date: ${new Date(appointment.payment.timestamp).toLocaleDateString('en-IN')}`, 50, 165)
       .text(`Session Date: ${new Date(appointment.date).toLocaleDateString('en-IN')}`, 50, 180)
       .text(`Payment Method: ${appointment.payment.method || 'Online'}`, 50, 195);
    
    // Client details
    doc.fontSize(14).fillColor('#000').text('Bill To:', 300, 140);
    doc.fontSize(11).fillColor('#666')
       .text(appointment.client.name, 300, 165)
       .text(appointment.client.email, 300, 180);
    
    // Service details table
    doc.fontSize(14).fillColor('#000').text('Service Details', 50, 240);
    
    // Table header
    doc.rect(50, 265, 500, 25).fill('#f3f4f6');
    doc.fontSize(11).fillColor('#000')
       .text('Description', 60, 275)
       .text('Counsellor', 250, 275)
       .text('Duration', 400, 275)
       .text('Amount', 480, 275);
    
    // Table row
    doc.rect(50, 290, 500, 25).stroke('#e5e7eb');
    doc.fontSize(10).fillColor('#666')
       .text(`${appointment.sessionType.charAt(0).toUpperCase() + appointment.sessionType.slice(1)} Session`, 60, 300)
       .text(appointment.counsellor.user.name, 250, 300)
       .text(`${appointment.startTime || 'N/A'} - ${appointment.endTime || 'N/A'}`, 400, 300)
       .text(`₹${totalAmount.toFixed(2)}`, 480, 300);
    
    // Payment summary
    doc.fontSize(14).fillColor('#000').text('Payment Summary', 350, 340);
    
    const summaryY = 365;
    
    doc.fontSize(11).fillColor('#666')
       .text('Session Fee:', 350, summaryY)
       .text(`₹${totalAmount.toFixed(2)}`, 480, summaryY)
       .text(`Platform Fee (${marginPercentage}%):`, 350, summaryY + 20)
       .text(`₹${platformFee.toFixed(2)}`, 480, summaryY + 20);
    
    // Total line
    doc.moveTo(350, summaryY + 45).lineTo(520, summaryY + 45).stroke('#000');
    doc.fontSize(12).fillColor('#000')
       .text('Total Paid:', 350, summaryY + 55)
       .text(`₹${totalAmount.toFixed(2)}`, 480, summaryY + 55);
    
    // Footer
    doc.fontSize(10).fillColor('#666')
       .text('Thank you for choosing S S Psychologist Life Care', 50, 500)
       .text('For support, contact: support@sspsychologist.com', 50, 515)
       .text('This is a computer generated invoice.', 50, 530);

    doc.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Get client payment history
// @route   GET /api/payments/client/history
// @access  Private (Client)
exports.getClientPaymentHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const appointments = await Appointment.find({
      client: req.user.id,
      'payment.status': 'completed'
    })
    .populate('counsellor')
    .populate({
      path: 'counsellor',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .sort({ 'payment.timestamp': -1 })
    .limit(limit)
    .skip(startIndex);

    const total = await Appointment.countDocuments({
      client: req.user.id,
      'payment.status': 'completed'
    });

    res.status(200).json({
      success: true,
      count: appointments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

