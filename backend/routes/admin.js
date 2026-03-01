const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDeposits = await Transaction.countDocuments({ type: 'deposit' });
    const totalWithdrawals = await Transaction.countDocuments({ type: 'withdrawal' });
    const pendingDeposits = await Transaction.countDocuments({ type: 'deposit', status: 'pending' });
    const pendingWithdrawals = await Transaction.countDocuments({ type: 'withdrawal', status: 'pending' });
    const pendingKyc = await User.countDocuments({ kycStatus: 'pending' });
    res.json({ totalUsers, totalDeposits, totalWithdrawals, pendingDeposits, pendingWithdrawals, pendingKyc });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user balance
router.put('/users/:id/balance', adminAuth, async (req, res) => {
  try {
    const { balance } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { balance }, { new: true }).select('-password');
    res.json({ message: 'Balance updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user block
router.put('/users/:id/block', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all deposits
router.get('/deposits', adminAuth, async (req, res) => {
  try {
    const deposits = await Transaction.find({ type: 'deposit' }).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject deposit
router.put('/deposits/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const deposit = await Transaction.findById(req.params.id);
    if (!deposit) return res.status(404).json({ message: 'Deposit not found' });
    deposit.status = status;
    await deposit.save();
    if (status === 'approved') {
      await User.findByIdAndUpdate(deposit.user, { $inc: { balance: deposit.amount, totalDeposits: deposit.amount } });
    }
    res.json({ message: `Deposit ${status}`, deposit });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all withdrawals
router.get('/withdrawals', adminAuth, async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ type: 'withdrawal' }).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject withdrawal
router.put('/withdrawals/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const withdrawal = await Transaction.findById(req.params.id);
    if (!withdrawal) return res.status(404).json({ message: 'Withdrawal not found' });
    withdrawal.status = status;
    await withdrawal.save();
    if (status === 'rejected') {
      await User.findByIdAndUpdate(withdrawal.user, { $inc: { balance: withdrawal.amount } });
    }
    res.json({ message: `Withdrawal ${status}`, withdrawal });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all KYC
router.get('/kyc', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ kycStatus: { $in: ['pending', 'approved', 'rejected'] } }).select('firstName lastName email kycStatus kycData createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/reject KYC
router.put('/kyc/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { kycStatus: status }, { new: true }).select('-password');
    res.json({ message: `KYC ${status}`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message to user
router.post('/users/:id/message', adminAuth, async (req, res) => {
  try {
    const { message } = req.body;
    await User.findByIdAndUpdate(req.params.id, { adminMessage: message });
    res.json({ message: 'Message sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// Get all trades
router.get('/trades', adminAuth, async (req, res) => {
  try {
    const Trade = require('../models/Trade');
    const trades = await Trade.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update trade result and status
router.put('/trades/:id', adminAuth, async (req, res) => {
  try {
    const Trade = require('../models/Trade');
    const { result, status } = req.body;
    const trade = await Trade.findById(req.params.id);
    if (!trade) return res.status(404).json({ message: 'Trade not found' });

    trade.result = parseFloat(result);
    trade.status = status;
    if (status === 'closed') trade.closedAt = new Date();
    await trade.save();

    // Update user balance and profit if closed
    if (status === 'closed') {
      await User.findByIdAndUpdate(trade.user, {
        $inc: {
          balance: parseFloat(result),
          totalProfit: parseFloat(result) > 0 ? parseFloat(result) : 0,
        }
      });
    }

    res.json({ message: 'Trade updated', trade });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
