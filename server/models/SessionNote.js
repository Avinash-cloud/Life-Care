const mongoose = require('mongoose');

const sessionNoteSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  privateNotes: {
    type: String,
    required: false
  },
  publicNotes: {
    type: String,
    required: false
  },
  diagnosis: {
    type: String,
    required: false
  },
  treatmentPlan: {
    type: String,
    required: false
  },
  followUpRecommended: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  isSharedWithClient: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure only counsellor who owns the appointment can create/edit notes
sessionNoteSchema.pre('save', async function(next) {
  try {
    const Appointment = mongoose.model('Appointment');
    const appointment = await Appointment.findById(this.appointment);
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    if (appointment.counsellor.toString() !== this.counsellor.toString()) {
      throw new Error('Not authorized to create/edit notes for this appointment');
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('SessionNote', sessionNoteSchema);