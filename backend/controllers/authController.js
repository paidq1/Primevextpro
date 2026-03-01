const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, country, password, referralCode } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'Please fill all required fields' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' });

    const emailToken = crypto.randomBytes(32).toString('hex');
    const emailTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const userData = { firstName, lastName, email, phone, country, password, emailToken, emailTokenExpire };

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        userData.referredBy = referrer._id;
        await User.findByIdAndUpdate(referrer._id, { $inc: { totalReferrals: 1 } });
      }
    }

    const user = await User.create(userData);

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;

    console.log('Sending email to:', user.email);
    // Send email in background - don't await
    sendEmail({
      to: user.email,
      subject: 'Verify Your PrimeVest Pro Account',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; background: #1e2538; color: white; padding: 30px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <svg viewBox="0 0 40 40" fill="none" width="48" height="48" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L4 10V22L20 38L36 22V10L20 2Z" fill="#0d1117" stroke="#6366F1" stroke-width="1.5"/>
              <path d="M20 8L8 14V22L20 34L32 22V14L20 8Z" fill="#0d1117" stroke="#6366F1" stroke-width="1.2"/>
              <path d="M20 14L12 18V23L20 30L28 23V18L20 14Z" fill="#6366F1" stroke="#6366F1" stroke-width="1"/>
            </svg>
            <h1 style="color: white; font-size: 20px; margin: 12px 0 4px;">PrimeVest Pro</h1>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px;">Email Verification</p>
          </div>
          <h2 style="color: white; font-size: 16px; margin-bottom: 8px;">Hello ${user.firstName},</h2>
          <p style="color: rgba(255,255,255,0.7); font-size: 13px; line-height: 1.6;">Thank you for registering with PrimeVest Pro. Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verifyUrl}" style="background: #6366f1; color: white; padding: 12px 32px; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 4px; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-align: center;">This link expires in 24 hours. If you did not create an account, please ignore this email.</p>
        </div>
      `
    });

    res.status(201).json({ message: 'Registration successful! Please check your email to verify your account.' });
    console.log('Email sending in background...');

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email not found' });
    if (user.emailVerified) return res.status(400).json({ message: 'Email already verified' });

    const emailToken = crypto.randomBytes(32).toString('hex');
    user.emailToken = emailToken;
    user.emailTokenExpire = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${emailToken}`;
    // Send email in background - don't await
    sendEmail({
      to: user.email,
      subject: 'Verify Your PrimeVest Pro Account',
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; background: #1e2538; color: white; padding: 30px; border-radius: 8px;">
          <h2 style="color: white;">Hello ${user.firstName},</h2>
          <p style="color: rgba(255,255,255,0.7);">Click below to verify your email address.</p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${verifyUrl}" style="background: #6366f1; color: white; padding: 12px 32px; text-decoration: none; font-size: 13px; font-weight: 600; border-radius: 4px; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-align: center;">This link expires in 24 hours.</p>
        </div>
      `
    });
    res.json({ message: 'Verification email resent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ emailToken: token, emailTokenExpire: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link.' });

    user.emailVerified = true;
    user.emailToken = undefined;
    user.emailTokenExpire = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully! You can now log in.' });
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

    if (!user.emailVerified)
      return res.status(400).json({ message: 'Please verify your email before logging in.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

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
