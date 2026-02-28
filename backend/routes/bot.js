const express = require('express');
const router = express.Router();
const Bot = require('../models/Bot');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

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

// Subscribe to bot
router.post('/', auth, upload.single('paymentProof'), async (req, res) => {
  try {
    const { botName, amount, paymentMethod } = req.body;

    if (!botName || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Bot details mapping
    const botDetails = {
      'STARTER BOT': { dailyRate: '5%', duration: '7 days', days: 7 },
      'SILVER BOT':  { dailyRate: '8%', duration: '14 days', days: 14 },
      'GOLD BOT':    { dailyRate: '12%', duration: '30 days', days: 30 },
      'PLATINUM BOT':{ dailyRate: '18%', duration: '60 days', days: 60 },
    };

    const details = botDetails[botName] || { dailyRate: '5%', duration: '7 days', days: 7 };
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + details.days);

    const bot = new Bot({
      user: req.user.id,
      botName,
      amount: Number(amount),
      paymentMethod,
      paymentProof: req.file ? '/uploads/' + req.file.filename : '',
      dailyRate: details.dailyRate,
      duration: details.duration,
      expiresAt,
    });

    await bot.save();
    res.json({ success: true, bot });
  } catch (err) {
    console.error('Bot error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
