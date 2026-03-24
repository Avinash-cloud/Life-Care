const mongoose = require('mongoose');

const paymentSettingsSchema = new mongoose.Schema({
  globalMargin: {
    type: Number,
    default: 20, // 20% platform fee
    min: 0,
    max: 50
  },
  counsellorMargins: [{
    counsellor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Counsellor',
      required: true
    },
    margin: {
      type: Number,
      required: true,
      min: 0,
      max: 50
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('PaymentSettings', paymentSettingsSchema);