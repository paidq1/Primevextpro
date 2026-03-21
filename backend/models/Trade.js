const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  account: { type: String, enum: ['real', 'demo'], default: 'real' },
  market: { type: String, default: 'crypto' },
  symbol: { type: String, required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  amount: { type: Number, required: true },
  leverage: { type: String },
  duration: { type: String },
  result: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'active', 'closed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
  expiresAt: { type: Date },
  openPrice: { type: Number, default: 0 },
  closePrice: { type: Number, default: 0 },
  stopLoss: { type: Number, default: null },
  takeProfit: { type: Number, default: null },
  profitLoss: { type: Number, default: 0 },
});

module.exports = mongoose.model('Trade', tradeSchema);
