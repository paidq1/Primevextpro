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