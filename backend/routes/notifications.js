const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get real notifications from user's activity
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = [];

    // Get deposits
    const Deposit = require('../models/Deposit');
    const deposits = await Deposit.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
    deposits.forEach(d => {
      notifications.push({
        id: d._id,
        icon: d.status === 'approved' ? '💰' : d.status === 'rejected' ? '❌' : '⏳',
        title: `Deposit ${d.status === 'approved' ? 'Confirmed' : d.status === 'rejected' ? 'Rejected' : 'Pending'}`,
        desc: `Your deposit of ${d.amount} ${d.currency || 'USD'} is ${d.status}.`,
        time: d.createdAt,
        unread: d.status === 'approved' || d.status === 'rejected',
        type: 'deposit'
      });
    });

    // Get withdrawals
    const Withdrawal = require('../models/Withdrawal');
    const withdrawals = await Withdrawal.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
    withdrawals.forEach(w => {
      notifications.push({
        id: w._id,
        icon: w.status === 'approved' ? '💸' : w.status === 'rejected' ? '❌' : '⏳',
        title: `Withdrawal ${w.status === 'approved' ? 'Processed' : w.status === 'rejected' ? 'Rejected' : 'Pending'}`,
        desc: `Your withdrawal of ${w.amount} USD is ${w.status}.`,
        time: w.createdAt,
        unread: w.status === 'approved' || w.status === 'rejected',
        type: 'withdrawal'
      });
    });

    // KYC status
    const user = await User.findById(userId);
    if (user.kycStatus === 'approved') {
      notifications.push({
        id: 'kyc-approved',
        icon: '✅',
        title: 'KYC Approved',
        desc: 'Your identity verification has been approved.',
        time: user.updatedAt,
        unread: false,
        type: 'kyc'
      });
    } else if (user.kycStatus === 'submitted') {
      notifications.push({
        id: 'kyc-pending',
        icon: '🔐',
        title: 'KYC Under Review',
        desc: 'Your KYC documents are being reviewed.',
        time: user.updatedAt,
        unread: true,
        type: 'kyc'
      });
    } else {
      notifications.push({
        id: 'kyc-reminder',
        icon: '🔐',
        title: 'KYC Reminder',
        desc: 'Complete your identity verification to unlock all features.',
        time: new Date(),
        unread: true,
        type: 'kyc'
      });
    }

    // Sort by time
    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.json(notifications);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
