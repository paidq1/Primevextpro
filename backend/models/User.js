const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  phoneCode: { type: String, trim: true, default: '+1' },
  country: { type: String, trim: true },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  address: { type: String, trim: true },
  dob: { type: String, trim: true },
  currency: { type: String, trim: true, default: 'US Dollar (USD)' },
  password: { type: String, required: true, minlength: 6 },
  accountType: { type: String, enum: ['real', 'demo'], default: 'real' },
  balance: { type: Number, default: 0 },
  totalDeposits: { type: Number, default: 0 },
  totalWithdrawals: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  totalReferrals: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  adminMessage: { type: String, default: '' },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  referralEarnings: { type: Number, default: 0 },
  referralClaimed: { type: Number, default: 0 },
  kycStatus: { type: String, enum: ['pending', 'submitted', 'approved', 'rejected'], default: 'pending' },
  kycData: { idType: String, idNumber: String, idFront: String, idBack: String, selfie: String, submittedAt: Date },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  emailVerified: { type: Boolean, default: false },
  emailVerifyToken: { type: String },
  emailVerifyExpire: { type: Date },
  emailToken: { type: String },
  emailTokenExpire: { type: Date },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorOTP: { type: String },
  twoFactorOTPExpire: { type: Date },
  currentPlan: { type: String, enum: ['none', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'ELITE'], default: 'none' },
  withdrawalCode: { type: String, default: '' },
  withdrawalCodeRequired: { type: Boolean, default: false },
  accountUpgraded: { type: Boolean, default: false },
  withdrawalBlocked: { type: Boolean, default: false },
  minimumWithdrawal: { type: Number, default: 100 },
});

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
