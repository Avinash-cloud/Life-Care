const mongoose = require('mongoose');

const callbackRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true
  },
  primaryConcern: {
    type: String,
    required: [true, 'Please provide your primary concern'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CallbackRequest', callbackRequestSchema);
