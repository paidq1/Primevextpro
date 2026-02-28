const express = require('express');
const router = express.Router();
const Stake = require('../models/Stake');
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
router.post('/', auth, upload.single('paymentProof'), async (req, res) => {
  try {
    const { plan, amount, apy, duration, paymentMethod } = req.body;

    if (!plan || !amount || !apy || !duration || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const days = parseInt(duration);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const stake = new Stake({
      user: req.user.id,
      plan,
      amount: Number(amount),
      apy,
      duration,
      paymentMethod,
      paymentProof: req.file ? '/uploads/' + req.file.filename : '',
      expiresAt,
    });

    await stake.save();
    res.json({ success: true, stake });
  } catch (err) {
    console.error('Stake error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
