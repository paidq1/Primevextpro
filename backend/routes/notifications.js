const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = [];

    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 }).limit(10);

    transactions.forEach(t => {
      let icon, title;
      if (t.type === 'deposit') {
        icon = t.status === 'approved' ? '💰' : t.status === 'rejected' ? '❌' : '⏳';
        title = `Deposit ${t.status === 'approved' ? 'Confirmed' : t.status === 'rejected' ? 'Rejected' : 'Pending'}`;
      } else if (t.type === 'withdrawal') {
        icon = t.status === 'approved' ? '💸' : t.status === 'rejected' ? '❌' : '⏳';
        title = `Withdrawal ${t.status === 'approved' ? 'Processed' : t.status === 'rejected' ? 'Rejected' : 'Pending'}`;
      } else if (t.type === 'profit') {
        icon = '📈';
        title = 'Profit Credited';
      } else if (t.type === 'referral') {
        icon = '🤝';
        title = 'Referral Bonus';
      }
      notifications.push({
        id: t._id,
        icon,
        title,
        desc: `${t.type.charAt(0).toUpperCase() + t.type.slice(1)} of $${t.amount} is ${t.status}.`,
        time: t.createdAt,
        unread: t.status === 'approved' || t.status === 'rejected',
        type: t.type
      });
    });

    // KYC notification
    const user = await User.findById(userId);
    if (user.kycStatus === 'approved') {
      notifications.push({ id: 'kyc', icon: '✅', title: 'KYC Approved', desc: 'Your identity verification has been approved.', time: user.updatedAt, unread: false, type: 'kyc' });
    } else if (user.kycStatus === 'submitted') {
      notifications.push({ id: 'kyc', icon: '🔐', title: 'KYC Under Review', desc: 'Your KYC documents are being reviewed.', time: user.updatedAt, unread: true, type: 'kyc' });
    } else {
      notifications.push({ id: 'kyc', icon: '🔐', title: 'KYC Reminder', desc: 'Complete verification to unlock all features.', time: new Date(), unread: true, type: 'kyc' });
    }

    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(notifications);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Mark notification as read (we track this client-side via localStorage for now)
router.patch('/read/:id', auth, async (req, res) => {
  try {
    const Notification = require('../models/Notification');
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true }
    );
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});
