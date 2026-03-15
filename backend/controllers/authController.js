const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, country, password, referralCode } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'Please fill all required fields' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const userData = {
      firstName, lastName, email, phone, country, password,
      emailVerified: false,
    };

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        userData.referredBy = referrer._id;
        await User.findByIdAndUpdate(referrer._id, { $inc: { totalReferrals: 1 } });
      }
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);

    // Send verification email
    try {
      const crypto = require('crypto');
      const verifyToken = crypto.randomBytes(32).toString('hex');
      user.emailVerifyToken = verifyToken;
      user.emailVerifyExpire = Date.now() + 24 * 60 * 60 * 1000;
      await user.save();
      await sendEmail({
        to: user.email,
        type: 'verifyEmail',
        name: user.firstName,
        verifyUrl: process.env.FRONTEND_URL + '/verify-email/' + verifyToken
      });
    } catch(emailErr) { console.log('Verification email error:', emailErr.message); }

    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: user.balance,
        accountType: user.accountType,
        referralCode: user.referralCode,
        kycStatus: user.kycStatus,
        isAdmin: user.isAdmin,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.emailVerified) {
      return res.status(400).json({ message: 'Please verify your email before logging in. Check your inbox.', emailNotVerified: true });
    }

    if (user.isBlocked) {
      return res.status(400).json({ message: 'Your account has been suspended. Please contact support.' });
    }

    // Check 2FA
    if (user.twoFactorEnabled) {
      const sendEmail = require('../utils/sendEmail');
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.twoFactorOTP = otp;
      user.twoFactorOTPExpire = Date.now() + 10 * 60 * 1000;
      await user.save();
      await sendEmail({ to: user.email, type: 'twoFactorOTP', name: user.firstName, code: otp });
      return res.json({ twoFactorRequired: true, email: user.email, message: 'OTP sent to your email' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        balance: user.balance,
        totalDeposits: user.totalDeposits,
        totalWithdrawals: user.totalWithdrawals,
        totalProfit: user.totalProfit,
        totalReferrals: user.totalReferrals,
        accountType: user.accountType,
        referralCode: user.referralCode,
        kycStatus: user.kycStatus,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
