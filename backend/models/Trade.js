const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account: { type: String, enum: ['real', 'demo'], default: 'real' },
  market: { type: String, required: true },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  amount: { type: Number, required: true },
  leverage: { type: String },
  duration: { type: String },
  result: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'closed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
});

module.exports = mongoose.model('Trade', tradeSchema);
