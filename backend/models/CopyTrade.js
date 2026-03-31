const mongoose = require('mongoose');
const CopyTradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trader: { type: mongoose.Schema.Types.ObjectId, ref: 'Trader', required: true },
  traderName: { type: String },
  traderImg: { type: String },
  amount: { type: Number, required: true },
  profitShare: { type: Number },
  status: { type: String, enum: ['active', 'stopped'], default: 'active' },
  totalEarned: { type: Number, default: 0 },
  endDate: { type: Date },
  lastProfitAt: { type: Date },
}, { timestamps: true });
module.exports = mongoose.model('CopyTrade', CopyTradeSchema);
