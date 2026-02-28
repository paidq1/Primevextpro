const express = require('express');
const router = express.Router();
const Stake = require('../models/Stake');
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
    const { plan, amount, apy, duration, paymentMethod } = req.body;

    if (!plan || !amount || !apy || !duration || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    // Calculate expiry date
    const days = parseInt(duration);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const stake = new Stake({
      user: req.user.id,
      plan,
      amount,
      apy,
      duration,
      paymentMethod,
      expiresAt,
    });

    await stake.save();
    res.json({ success: true, stake });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
