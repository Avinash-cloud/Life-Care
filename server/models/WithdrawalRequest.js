const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [100, 'Minimum withdrawal amount is 100']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processed'],
    default: 'pending'
  },
  bankDetails: {
    accountName: {
      type: String,
      required: [true, 'Please add account name']
    },
    accountNumber: {
      type: String,
      required: [true, 'Please add account number']
    },
    bankName: {
      type: String,
      required: [true, 'Please add bank name']
    },
    ifscCode: {
      type: String,
      required: [true, 'Please add IFSC code']
    }
  },
  transactionId: String,
  processedAt: Date,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String
}, { timestamps: true });

// Middleware to update counsellor earnings after withdrawal is processed
withdrawalRequestSchema.post('findOneAndUpdate', async function(doc) {
  const update = this.getUpdate();
  
  // If status is changed to processed, update counsellor earnings
  if (update.$set && update.$set.status === 'processed') {
    try {
      const Counsellor = mongoose.model('Counsellor');
      const counsellor = await Counsellor.findById(doc.counsellor);
      
      if (counsellor) {
        counsellor.earnings.withdrawn += doc.amount;
        counsellor.earnings.pending -= doc.amount;
        await counsellor.save();
      }
    } catch (err) {
      console.error('Error updating counsellor earnings:', err);
    }
  }
});

module.exports = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);