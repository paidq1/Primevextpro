const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Notification = require('../models/Notification');

const COMMISSION = 50; // $50 per referral

// Get referral stats
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('referralCode totalReferrals referralEarnings balance');
    const referredUsers = await User.find({ referredBy: req.user._id })
      .select('firstName lastName email createdAt emailVerified')
      .sort({ createdAt: -1 });

    res.json({
      referralCode: user.referralCode,
      totalReferrals: user.totalReferrals || 0,
      referralEarnings: user.referralEarnings || 0,
      commission: COMMISSION,
      referredUsers: referredUsers.map(u => ({
        username: u.firstName + ' ' + u.lastName,
        email: u.email,
        status: u.emailVerified ? 'Active' : 'Pending',
        date: u.createdAt,
        commission: COMMISSION
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Claim referral earnings
router.post('/claim', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const unclaimed = (user.referralEarnings || 0) - (user.referralClaimed || 0);
    
    if (unclaimed <= 0) return res.status(400).json({ message: 'No earnings to claim' });

    user.balance += unclaimed;
    user.referralClaimed = (user.referralClaimed || 0) + unclaimed;
    await user.save();

    await Notification.create({
      user: user._id,
      title: 'Referral Bonus Claimed 🎉',
      message: `$${unclaimed} referral bonus has been added to your balance.`,
      type: 'referral'
    });

    res.json({ success: true, message: `$${unclaimed} added to your balance!`, balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
