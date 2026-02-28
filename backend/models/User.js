const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  country: { type: String, trim: true },
  password: { type: String, required: true, minlength: 6 },
  accountType: { type: String, enum: ['real', 'demo'], default: 'real' },
  balance: { type: Number, default: 0 },
  totalDeposits: { type: Number, default: 0 },
  totalWithdrawals: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  totalReferrals: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  kycStatus: { type: String, enum: ['pending', 'submitted', 'approved', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

// Single pre-save hook for both password hashing and referral code
userSchema.pre('save', async function() {
  if (!this.referralCode) {
    this.referralCode = 'PV' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
