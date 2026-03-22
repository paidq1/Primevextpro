const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  roi: { type: String },
  duration: { type: String },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  profit: { type: Number, default: 0 },
  earned: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

module.exports = mongoose.model('Investment', investmentSchema);
