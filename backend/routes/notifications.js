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
      let icon, title, desc;
      if (t.type === 'deposit') {
        if (t.status === 'pending') { icon = '⏳'; title = 'Deposit Processing'; desc = `Your deposit of $${t.amount} is being reviewed.`; }
        else if (t.status === 'approved') { icon = '💰'; title = 'Deposit Confirmed'; desc = `Your deposit of $${t.amount} has been approved.`; }
        else { icon = '❌'; title = 'Deposit Rejected'; desc = `Your deposit of $${t.amount} was rejected.`; }
      } else if (t.type === 'withdrawal') {
        if (t.status === 'pending') { icon = '⏳'; title = 'Withdrawal Processing'; desc = `Your withdrawal of $${t.amount} is being processed.`; }
        else if (t.status === 'approved') { icon = '💸'; title = 'Withdrawal Successful'; desc = `Your withdrawal of $${t.amount} was processed.`; }
        else { icon = '❌'; title = 'Withdrawal Rejected'; desc = `Your withdrawal of $${t.amount} was rejected.`; }
      } else if (t.type === 'profit') { icon = '📈'; title = 'Profit Credited'; desc = `$${t.amount} profit credited to your account.`; }
      else if (t.type === 'referral') { icon = '🤝'; title = 'Referral Bonus'; desc = `You earned a $${t.amount} referral bonus.`; }
      notifications.push({ id: t._id, icon, title, desc, time: t.createdAt, unread: t.status !== 'pending', type: t.type });
    });

    const user = await User.findById(userId);
    if (user.kycStatus === 'approved') {
      notifications.push({ id: 'kyc', icon: '✅', title: 'KYC Approved', desc: 'Your identity has been verified.', time: user.updatedAt, unread: false, type: 'kyc' });
    } else if (user.kycStatus === 'submitted') {
      notifications.push({ id: 'kyc', icon: '🔍', title: 'KYC Under Review', desc: 'Your documents are being reviewed.', time: user.updatedAt, unread: true, type: 'kyc' });
    } else {
      notifications.push({ id: 'kyc', icon: '🔐', title: 'Complete KYC Verification', desc: 'Verify your identity to unlock withdrawals.', time: new Date(), unread: true, type: 'kyc' });
    }

    const accountAge = (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (accountAge < 7) {
      notifications.push({ id: 'welcome', icon: '🎉', title: 'Welcome to VertexTrade Pro!', desc: 'Start by making your first deposit to begin trading.', time: user.createdAt, unread: true, type: 'system' });
    }

    notifications.push({ id: 'security', icon: '🛡️', title: 'Security Tip', desc: 'Never share your password or OTP with anyone.', time: new Date(Date.now() - 86400000), unread: false, type: 'system' });

    try {
      const Investment = require('../models/Investment');
      const activeInvestments = await Investment.find({ user: userId, status: 'active' }).limit(1);
      if (activeInvestments.length === 0) {
        notifications.push({ id: 'invest', icon: '💡', title: 'Start Investing Today', desc: 'Explore our investment packages and start earning.', time: new Date(Date.now() - 3600000), unread: true, type: 'system' });
      }
    } catch(e) {}

    notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(notifications);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
