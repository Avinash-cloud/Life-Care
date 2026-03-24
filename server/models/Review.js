const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  counsellorResponse: {
    text: String,
    createdAt: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

// Prevent user from submitting more than one review per appointment
reviewSchema.index({ appointment: 1, client: 1 }, { unique: true });

// Static method to get average rating and update counsellor
reviewSchema.statics.getAverageRating = async function(counsellorId) {
  const obj = await this.aggregate([
    {
      $match: { counsellor: counsellorId, isApproved: true }
    },
    {
      $group: {
        _id: '$counsellor',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  try {
    const Counsellor = mongoose.model('Counsellor');
    await Counsellor.findByIdAndUpdate(counsellorId, {
      'ratings.average': obj[0]?.averageRating?.toFixed(1) || 0,
      'ratings.count': obj[0]?.count || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.counsellor);
});

// Call getAverageRating after remove
reviewSchema.post('remove', function() {
  this.constructor.getAverageRating(this.counsellor);
});

module.exports = mongoose.model('Review', reviewSchema);