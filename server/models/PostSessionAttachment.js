const mongoose = require('mongoose');

const postSessionAttachmentSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  attachmentType: {
    type: String,
    enum: ['text', 'image', 'document'],
    required: true
  },
  content: {
    text: {
      type: String,
      required: function() {
        return this.attachmentType === 'text';
      }
    },
    fileUrl: {
      type: String,
      required: function() {
        return this.attachmentType === 'image' || this.attachmentType === 'document';
      }
    },
    fileName: {
      type: String,
      required: function() {
        return this.attachmentType === 'image' || this.attachmentType === 'document';
      }
    },
    fileSize: {
      type: Number
    },
    mimeType: {
      type: String
    }
  },
  category: {
    type: String,
    enum: ['prescription', 'medicine', 'exercise', 'diet', 'general', 'followup'],
    default: 'general'
  },
  isVisible: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure only psychiatrists and psychologists can create attachments
postSessionAttachmentSchema.pre('save', async function(next) {
  try {
    const User = mongoose.model('User');
    const counsellor = await User.findById(this.counsellor);
    
    if (!counsellor) {
      throw new Error('Counsellor not found');
    }
    
    if (!['psychiatrist', 'psychologist'].includes(counsellor.counsellorType)) {
      throw new Error('Only psychiatrists and psychologists can create post-session attachments');
    }
    
    // Verify the appointment belongs to this counsellor
    const Appointment = mongoose.model('Appointment');
    const appointment = await Appointment.findById(this.appointment).populate('counsellor');
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    if (appointment.counsellor.user.toString() !== this.counsellor.toString()) {
      throw new Error('Not authorized to create attachments for this appointment');
    }
    
    if (appointment.status !== 'completed') {
      throw new Error('Can only add attachments to completed appointments');
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Index for faster queries
postSessionAttachmentSchema.index({ client: 1, createdAt: -1 });
postSessionAttachmentSchema.index({ appointment: 1 });
postSessionAttachmentSchema.index({ counsellor: 1, createdAt: -1 });

module.exports = mongoose.model('PostSessionAttachment', postSessionAttachmentSchema);