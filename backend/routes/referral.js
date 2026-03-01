const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get referral stats and referred users
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('referralCode totalReferrals balance');
    const referredUsers = await User.find({ referredBy: req.user._id })
      .select('firstName lastName email createdAt emailVerified')
      .sort({ createdAt: -1 });

    const commission = referredUsers.length * 10; // $10 per referral

    res.json({
      referralCode: user.referralCode,
      totalReferrals: user.totalReferrals,
      commission,
      referredUsers: referredUsers.map(u => ({
        username: u.firstName + ' ' + u.lastName,
        email: u.email,
        status: u.emailVerified ? 'Active' : 'Pending',
        date: u.createdAt,
        commission: 10
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
