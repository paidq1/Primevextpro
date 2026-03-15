const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  botName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  paymentProof: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'pending' },
  earned: { type: Number, default: 0 },
  dailyRate: { type: String, default: '' },
  duration: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  lastProfitAt: { type: Date },
  days: { type: Number, default: 7 },
});

module.exports = mongoose.model('Bot', botSchema);
