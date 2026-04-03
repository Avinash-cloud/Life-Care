const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number']
  },
  score: {
    type: Number,
    required: true
  },
  testUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
