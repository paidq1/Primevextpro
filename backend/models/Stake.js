const mongoose = require('mongoose');

const stakeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  apy: { type: String, required: true },
  duration: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentProof: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
  earned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  lastProfitAt: { type: Date },
});

module.exports = mongoose.model('Stake', stakeSchema);
