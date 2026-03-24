const Appointment = require('../models/Appointment');
const Counsellor = require('../models/Counsellor');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Get available slots for a counsellor on a specific date
// @route   GET /api/appointments/available-slots
// @access  Private
exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { counsellorId, date } = req.query;
    
    if (!counsellorId || !date) {
      return next(new ErrorResponse('Counsellor ID and date are required', 400));
    }

    // Prevent booking past dates
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return res.status(200).json({
        success: true,
        slots: [],
        message: 'Cannot book appointments for past dates'
      });
    }

    const counsellor = await Counsellor.findById(counsellorId);
    if (!counsellor) {
      return next(new ErrorResponse('Counsellor not found', 404));
    }
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    // Get counsellor's availability for the day
    const dayAvailability = counsellor.availability && counsellor.availability[dayOfWeek];
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return res.status(200).json({
        success: true,
        slots: [],
        message: `Counsellor is not available on ${dayOfWeek}`
      });
    }

    // Get existing appointments for the date
    const existingAppointments = await Appointment.find({
      counsellor: counsellorId,
      date: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lt: new Date(date + 'T23:59:59.999Z')
      },
      status: { $in: ['pending', 'confirmed'] }
    });

    // Generate available slots
    const slots = [];
    const startTime = dayAvailability.startTime;
    const endTime = dayAvailability.endTime;
    const slotDuration = 60; // 1 hour slots
    
    // Get current time for today's date
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    let currentTime = startTime;
    while (currentTime < endTime) {
      const nextTime = addMinutes(currentTime, slotDuration);
      
      // Check if slot is not booked
      const isBooked = existingAppointments.some(apt => 
        apt.startTime === currentTime && apt.endTime === nextTime
      );
      
      // Skip past time slots for today
      if (isToday) {
        const [slotHour, slotMinute] = currentTime.split(':').map(Number);
        const slotTimeInMinutes = slotHour * 60 + slotMinute;
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        if (slotTimeInMinutes <= currentTimeInMinutes) {
          currentTime = nextTime;
          continue;
        }
      }

      if (!isBooked) {
        slots.push({
          startTime: currentTime,
          endTime: nextTime
        });
      }

      currentTime = nextTime;
    }

    res.status(200).json({
      success: true,
      slots
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book appointment
// @route   POST /api/appointments/book
// @access  Private (Client)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { counsellorId, date, startTime, endTime, sessionType, notes } = req.body;
    
    // Prevent booking past dates and times
    const appointmentDate = new Date(date);
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    appointmentDate.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return next(new ErrorResponse('Cannot book appointments for past dates', 400));
    }
    
    // Check if booking time has passed for today
    const isToday = appointmentDate.toDateString() === today.toDateString();
    if (isToday) {
      const [slotHour, slotMinute] = startTime.split(':').map(Number);
      const slotTimeInMinutes = slotHour * 60 + slotMinute;
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      
      if (slotTimeInMinutes <= currentTimeInMinutes) {
        return next(new ErrorResponse('Cannot book appointments for past time slots', 400));
      }
    }
    
    // Validate counsellor
    const counsellor = await Counsellor.findById(counsellorId).populate('user');
    if (!counsellor || !counsellor.isVerified) {
      return next(new ErrorResponse('Counsellor not found or not verified', 404));
    }

    // Check slot availability
    const existingAppointment = await Appointment.findOne({
      counsellor: counsellorId,
      date: new Date(date),
      startTime,
      endTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return next(new ErrorResponse('This slot is already booked', 400));
    }

    // Calculate amount
    const duration = getTimeDifference(startTime, endTime);
    let amount = 0;
    
    switch (sessionType) {
      case 'video':
        amount = counsellor.fees.video || counsellor.fees;
        break;
      case 'chat':
        amount = counsellor.fees.chat || counsellor.fees;
        break;
      case 'in-person':
        amount = counsellor.fees.inPerson || counsellor.fees;
        break;
      default:
        amount = counsellor.fees.video || counsellor.fees;
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `apt_${Date.now()}`,
      notes: {
        counsellorId,
        clientId: req.user.id,
        sessionType
      }
    });

    // Create appointment
    const appointment = await Appointment.create({
      client: req.user.id,
      counsellor: counsellorId,
      date: new Date(date),
      startTime,
      endTime,
      duration,
      sessionType,
      amount,
      notes,
      payment: {
        id: razorpayOrder.id,
        status: 'pending'
      }
    });

    res.status(201).json({
      success: true,
      data: {
        appointment,
        razorpayOrder: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key_id: process.env.RAZORPAY_KEY_ID
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment and confirm appointment
// @route   POST /api/appointments/verify-payment
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return next(new ErrorResponse('Payment verification failed', 400));
    }

    // Update appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return next(new ErrorResponse('Appointment not found', 404));
    }

    appointment.payment.status = 'completed';
    appointment.payment.method = 'razorpay';
    appointment.payment.timestamp = new Date();
    appointment.status = 'confirmed';

    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified and appointment confirmed',
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function addMinutes(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
}

function getTimeDifference(startTime, endTime) {
  const [startHours, startMins] = startTime.split(':').map(Number);
  const [endHours, endMins] = endTime.split(':').map(Number);
  
  const startTotalMins = startHours * 60 + startMins;
  const endTotalMins = endHours * 60 + endMins;
  
  return endTotalMins - startTotalMins;
}

module.exports = exports;