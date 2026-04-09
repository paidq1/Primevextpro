const mongoose = require('mongoose');
const TraderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String },
  location: { type: String },
  flag: { type: String },
  followers: { type: String },
  risk: { type: Number },
  favorite: { type: String },
  totalTrades: { type: Number },
  totalLoss: { type: Number },
  profitShare: { type: Number },
  winRate: { type: Number },
  img: { type: String },
  bio: { type: String, default: '' },
  verified: { type: Boolean, default: true },
  order: { type: Number, default: 99 },
}, { timestamps: true });
module.exports = mongoose.model('Trader', TraderSchema);
