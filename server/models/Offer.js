const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the offer or scheme'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  offerCode: {
    type: String,
    uppercase: true,
    trim: true
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount must be at least 0'],
    max: [100, 'Discount cannot exceed 100']
  },
  imageUrl: {
    type: String
  },
  validUntil: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', offerSchema);
