const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  sessionType: {
    type: String,
    enum: ['video', 'chat', 'in-person'],
    required: true
  },
  sessionUrl: {
    type: String // For video/chat sessions
  },
  amount: {
    type: Number,
    required: true
  },
  payment: {
    id: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'refunded', 'failed'],
      default: 'pending'
    },
    method: String,
    timestamp: Date,
    totalAmount: Number,
    platformFee: Number,
    counsellorAmount: Number,
    marginPercentage: Number,
    invoiceNumber: String
  },
  cancellation: {
    reason: String,
    cancelledBy: {
      type: String,
      enum: ['client', 'counsellor', 'admin']
    },
    timestamp: Date,
    refundStatus: {
      type: String,
      enum: ['not-applicable', 'pending', 'processed', 'rejected'],
      default: 'not-applicable'
    }
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: Date
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for session notes
appointmentSchema.virtual('sessionNotes', {
  ref: 'SessionNote',
  localField: '_id',
  foreignField: 'appointment'
});

// Index for faster queries
appointmentSchema.index({ client: 1, date: 1 });
appointmentSchema.index({ counsellor: 1, date: 1 });
appointmentSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);