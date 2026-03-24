const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  isAvailable: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    default: '09:00'
  },
  endTime: {
    type: String,
    default: '17:00'
  },
  slots: [{
    startTime: String,
    endTime: String,
    isBooked: {
      type: Boolean,
      default: false
    }
  }]
});

const qualificationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  certificate: {
    type: String // URL to certificate image
  }
});

const counsellorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  specializations: [{
    type: String,
    required: [true, 'Please add at least one specialization']
  }],
  qualifications: [qualificationSchema],
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  languages: [{
    type: String
  }],
  fees: {
    video: {
      type: Number,
      required: [true, 'Please add video session fee']
    },
    chat: {
      type: Number,
      required: [true, 'Please add chat session fee']
    },
    inPerson: {
      type: Number
    }
  },
  availability: {
    monday: availabilitySchema,
    tuesday: availabilitySchema,
    wednesday: availabilitySchema,
    thursday: availabilitySchema,
    friday: availabilitySchema,
    saturday: availabilitySchema,
    sunday: availabilitySchema
  },
  sessionDuration: {
    type: Number,
    default: 60, // in minutes
    enum: [30, 45, 60, 90]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationDocuments: [{
    type: String // URLs to verification documents
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    withdrawn: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    }
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  socialMedia: {
    linkedin: String,
    twitter: String,
    website: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for upcoming appointments
counsellorSchema.virtual('upcomingAppointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'counsellor',
  match: { 
    status: { $in: ['pending', 'confirmed'] },
    date: { $gte: new Date() }
  }
});

// Virtual for completed appointments
counsellorSchema.virtual('completedAppointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'counsellor',
  match: { status: 'completed' }
});

// Method to check availability for a specific date and time
counsellorSchema.methods.isAvailableAt = function(date, startTime, endTime) {
  const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const dayAvailability = this.availability[dayOfWeek];
  
  if (!dayAvailability.isAvailable) {
    return false;
  }
  
  // Check if the requested time is within counsellor's working hours
  if (startTime < dayAvailability.startTime || endTime > dayAvailability.endTime) {
    return false;
  }
  
  // Check if the slot is already booked
  const bookedSlot = dayAvailability.slots.find(
    slot => (startTime >= slot.startTime && startTime < slot.endTime) || 
           (endTime > slot.startTime && endTime <= slot.endTime) ||
           (startTime <= slot.startTime && endTime >= slot.endTime)
  );
  
  return !bookedSlot || !bookedSlot.isBooked;
};

module.exports = mongoose.model('Counsellor', counsellorSchema);