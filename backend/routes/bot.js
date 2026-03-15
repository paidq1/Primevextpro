const express = require('express');
const router = express.Router();
const Bot = require('../models/Bot');
const User = require('../models/User');
const auth = require('../middleware/auth');

const botDetails = {
  'STARTER BOT':  { dailyRate: '10%', duration: '7 days',  days: 7,  amount: 500  },
  'SILVER BOT':   { dailyRate: '16%', duration: '14 days', days: 14, amount: 1000 },
  'GOLD BOT':     { dailyRate: '24%', duration: '30 days', days: 30, amount: 2500 },
  'PLATINUM BOT': { dailyRate: '36%', duration: '60 days', days: 60, amount: 5000 },
  'DIAMOND BOT':  { dailyRate: '50%', duration: '90 days', days: 90, amount: 10000},
  'ELITE BOT':    { dailyRate: '70%', duration: '120 days',days: 120,amount: 25000},
};

// Get all bots for user
router.get('/', auth, async (req, res) => {
  try {
    const bots = await Bot.find({ user: req.user.id }).sort({ createdAt: -1 });
    const totalEarned = bots.reduce((sum, b) => sum + (b.earned || 0), 0);
    res.json({ bots, totalEarned });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Subscribe to bot - deduct from balance
router.post('/', auth, async (req, res) => {
  try {
    const { botName } = req.body;
    if (!botName) return res.status(400).json({ message: 'Bot name required' });

    const details = botDetails[botName];
    if (!details) return res.status(400).json({ message: 'Invalid bot type' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.balance < details.amount) return res.status(400).json({ message: `Insufficient balance. You need $${details.amount.toLocaleString()} to subscribe to this bot.` });

    // Deduct balance
    await User.findByIdAndUpdate(req.user.id, { $inc: { balance: -details.amount } });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + details.days);

    const bot = await Bot.create({
      user: req.user.id,
      botName,
      amount: details.amount,
      paymentMethod: 'balance',
      dailyRate: details.dailyRate,
      duration: details.duration,
      days: details.days,
      status: 'active',
      expiresAt,
    });

    res.json({ success: true, bot });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Cancel bot - refund balance
router.delete('/:id', auth, async (req, res) => {
  try {
    const bot = await Bot.findOne({ _id: req.params.id, user: req.user.id });
    if (!bot) return res.status(404).json({ message: 'Bot not found' });
    if (bot.status !== 'active') return res.status(400).json({ message: 'Bot is not active' });

    await User.findByIdAndUpdate(req.user.id, { $inc: { balance: bot.amount } });
    await Bot.findByIdAndUpdate(req.params.id, { status: 'cancelled' });

    res.json({ success: true, message: 'Bot cancelled and balance refunded' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
 
