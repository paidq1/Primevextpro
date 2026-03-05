const express = require('express');
const router = express.Router();
const Stake = require('../models/Stake');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Get all stakes for user
router.get('/', auth, async (req, res) => {
  try {
    const stakes = await Stake.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(stakes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new stake
router.post('/', auth, async (req, res) => {
  try {
    const { plan, amount, apy, duration } = req.body;

    if (!plan || !amount || !apy || !duration) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Check user balance
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.balance < Number(amount)) {
      return res.status(400).json({ message: `Insufficient balance. You need $${Number(amount).toLocaleString()} to stake.` });
    }

    // Deduct from balance
    await User.findByIdAndUpdate(req.user.id, { $inc: { balance: -Number(amount) } });

    const days = parseInt(duration);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const stake = new Stake({
      user: req.user.id,
      plan,
      amount: Number(amount),
      apy,
      duration,
      paymentMethod: 'balance',
      status: 'active',
      expiresAt,
    });

    await stake.save();

    // Send notification
    await Notification.create({
      user: req.user.id,
      title: 'Stake Activated ✅',
      message: `Your ${plan} stake of $${Number(amount).toLocaleString()} at ${apy} APY has been activated for ${duration}.`,
      type: 'deposit'
    });

    res.json({ success: true, stake });
  } catch (err) {
    console.error('Stake error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
