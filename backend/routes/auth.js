const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { register, login, getMe, changePassword } = require('../controllers/authController');
const auth = require('../middleware/auth');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        name: user.firstName || user.email,
        subject: 'Reset your password',
        resetUrl,
      });
      res.json({ success: true, message: 'Password reset link has been sent to your email.' });
    } catch(emailErr) {
      res.json({ success: true, message: 'Password reset link sent to your email.', resetUrl });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Reset password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      emailVerifyToken: req.params.token,
      emailVerifyExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired verification link' });

    user.emailVerified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpire = undefined;
    await user.save();

    // Send welcome email after verification
    try {
      const sendEmail = require('../utils/sendEmail');
      await sendEmail({ to: user.email, type: 'welcome', name: user.firstName });
    } catch(e) {}

    res.json({ success: true, message: 'Email verified successfully! You can now login.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
// Resend verification email
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    const User = require('../models/User');
    const crypto = require('crypto');
    const sendEmail = require('../utils/sendEmail');

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailVerified) return res.status(400).json({ message: 'Email already verified' });

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

    res.json({ success: true, message: 'Verification email sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Enable/Disable 2FA
router.put('/2fa/toggle', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();
    res.json({ message: `2FA ${user.twoFactorEnabled ? 'enabled' : 'disabled'}`, twoFactorEnabled: user.twoFactorEnabled });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send 2FA OTP
router.post('/2fa/send', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.twoFactorEnabled) return res.status(400).json({ message: '2FA not enabled' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.twoFactorOTP = otp;
    user.twoFactorOTPExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendEmail({ to: user.email, type: 'twoFactorOTP', name: user.firstName, otp });
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify 2FA OTP
router.post('/2fa/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.twoFactorOTP || user.twoFactorOTP !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (Date.now() > new Date(user.twoFactorOTPExpire)) return res.status(400).json({ message: 'OTP expired. Please request a new one.' });

    user.twoFactorOTP = undefined;
    user.twoFactorOTPExpire = undefined;
    await user.save();

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ success: true, token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send 6-digit OTP for password change
router.post('/send-change-otp', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = otp;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      name: user.firstName || user.email,
      type: 'twoFactorOTP',
      code: otp
    });

    res.json({ message: 'OTP sent successfully' });
  } catch(e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP for password change
router.post('/verify-change-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired code' });
    const token = user.resetPasswordToken;
    res.json({ message: 'OTP verified', token });
  } catch(e) {
    res.status(500).json({ message: 'Server error' });
  }
});
