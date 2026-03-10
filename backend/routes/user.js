const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile, getDashboard, deleteAvatar } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/dashboard', auth, getDashboard);
router.put('/profile', auth, upload.single('avatar'), updateProfile);
router.delete('/avatar', auth, deleteAvatar);

module.exports = router;

const Transaction = require('../models/Transaction');

router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
