const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const sendEmail = require('../utils/sendEmail');
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

// Update user stats
router.put('/users/:id/stats', adminAuth, async (req, res) => {
  try {
    const { totalDeposits, totalWithdrawals, totalProfit, totalReferrals, totalPackages } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { totalDeposits, totalWithdrawals, totalProfit, totalReferrals, totalPackages },
      { new: true }
    ).select('-password');
    res.json({ message: 'Stats updated', user });
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

router.delete('/users/:id/message', adminAuth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { adminMessage: '' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
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

    // Refund balance if cancelled and trade was real account
    if (status === 'cancelled' && trade.account === 'real') {
      await User.findByIdAndUpdate(trade.user, { $inc: { balance: trade.amount } });
    }
    }

    res.json({ message: 'Trade updated', trade });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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

// Approve/Reject deposit
router.put('/deposits/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    transaction.status = status;
    await transaction.save();

    if (status === 'approved') {
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { balance: transaction.amount, totalDeposits: transaction.amount }
      });
    }

    // Send email notification
    try {
      const user = await User.findById(transaction.user);
      if (user) {
        const isApproved = status === 'approved';
        await sendEmail({
          to: user.email,
          subject: isApproved ? '✅ Deposit Approved - VertexTrade Pro' : '❌ Deposit Rejected - VertexTrade Pro',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1e2538; color: white; padding: 30px; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #6366f1; font-size: 24px; margin: 0;">VertexTrade Pro</h1>
              </div>
              <div style="background: #252d3d; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h2 style="color: ${isApproved ? '#22c55e' : '#ef4444'}; font-size: 18px; margin: 0 0 16px;">
                  ${isApproved ? '✅ Deposit Approved' : '❌ Deposit Rejected'}
                </h2>
                <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">Dear ${user.firstName} ${user.lastName},</p>
                <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">
                  Your deposit of <strong style="color: #22c55e;">$${transaction.amount.toFixed(2)}</strong> via <strong>${transaction.method}</strong> has been <strong style="color: ${isApproved ? '#22c55e' : '#ef4444'};">${status}</strong>.
                </p>
                ${isApproved ? `<p style="color: #e2e8f0; font-size: 14px;">Your account balance has been updated. You can now use your funds to invest and trade.</p>` : `<p style="color: #e2e8f0; font-size: 14px;">Unfortunately your deposit was not approved. Please contact support if you have any questions.</p>`}
              </div>
              <div style="background: #2d3748; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">Amount: <strong style="color: white;">$${transaction.amount.toFixed(2)}</strong></p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 4px 0 0;">Method: <strong style="color: white;">${transaction.method}</strong></p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 4px 0 0;">Status: <strong style="color: ${isApproved ? '#22c55e' : '#ef4444'};">${status.toUpperCase()}</strong></p>
              </div>
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-align: center;">VertexTrade Pro - Your trusted investment platform</p>
            </div>
          `
        });
      }
    } catch(emailErr) { console.log('Email error:', emailErr.message); }

    res.json({ message: 'Deposit ' + status, transaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
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

// Approve/Reject withdrawal
router.put('/withdrawals/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    const prevStatus = transaction.status;
    transaction.status = status;
    await transaction.save();

    if (status === 'approved' && prevStatus === 'pending') {
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { totalWithdrawals: transaction.amount }
      });
    } else if (status === 'rejected' && prevStatus === 'pending') {
      await User.findByIdAndUpdate(transaction.user, {
        $inc: { balance: transaction.amount }
      });
    }

    // Send email notification
    try {
      const user = await User.findById(transaction.user);
      if (user) {
        const isApproved = status === 'approved';
        await sendEmail({
          to: user.email,
          subject: isApproved ? '✅ Withdrawal Approved - VertexTrade Pro' : '❌ Withdrawal Rejected - VertexTrade Pro',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1e2538; color: white; padding: 30px; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #6366f1; font-size: 24px; margin: 0;">VertexTrade Pro</h1>
              </div>
              <div style="background: #252d3d; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <h2 style="color: ${isApproved ? '#22c55e' : '#ef4444'}; font-size: 18px; margin: 0 0 16px;">
                  ${isApproved ? '✅ Withdrawal Approved' : '❌ Withdrawal Rejected'}
                </h2>
                <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">Dear ${user.firstName} ${user.lastName},</p>
                <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">
                  Your withdrawal of <strong style="color: #ec4899;">$${transaction.amount.toFixed(2)}</strong> via <strong>${transaction.method}</strong> has been <strong style="color: ${isApproved ? '#22c55e' : '#ef4444'};">${status}</strong>.
                </p>
                ${isApproved ? `<p style="color: #e2e8f0; font-size: 14px;">Your withdrawal is being processed and will be sent to your account shortly.</p>` : `<p style="color: #e2e8f0; font-size: 14px;">Your withdrawal was rejected and your funds have been returned to your account balance. Please contact support if you have any questions.</p>`}
              </div>
              <div style="background: #2d3748; padding: 12px; border-radius: 4px; margin-bottom: 20px;">
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">Amount: <strong style="color: white;">$${transaction.amount.toFixed(2)}</strong></p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 4px 0 0;">Method: <strong style="color: white;">${transaction.method}</strong></p>
                <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 4px 0 0;">Status: <strong style="color: ${isApproved ? '#22c55e' : '#ef4444'};">${status.toUpperCase()}</strong></p>
              </div>
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-align: center;">VertexTrade Pro - Your trusted investment platform</p>
            </div>
          `
        });
      }
    } catch(emailErr) { console.log('Email error:', emailErr.message); }

    res.json({ message: 'Withdrawal ' + status, transaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all KYC submissions
router.get('/kyc', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ kycStatus: { $in: ['submitted', 'approved', 'rejected'] } }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Approve/Reject KYC
router.put('/kyc/:id', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { kycStatus: status }, { new: true }).select('-password');
    res.json({ message: 'KYC ' + status, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Send email to user
router.post('/users/:id/email', adminAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ message: 'Subject and message required' });
    
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await sendEmail({
      to: user.email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1e2538; color: white; padding: 30px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #6366f1; font-size: 24px;">VertexTrade Pro</h1>
          </div>
          <div style="background: #252d3d; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">Dear ${user.firstName} ${user.lastName},</p>
            <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-line;">${message}</p>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-align: center;">This email was sent from VertexTrade Pro admin panel.</p>
        </div>
      `
    });

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send email', error: err.message });
  }
});

// Send bulk email to all users
router.post('/email/bulk', adminAuth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ message: 'Subject and message required' });

    const users = await User.find({ isActive: true }).select('email firstName lastName');
    
    let sent = 0;
    for (const user of users) {
      try {
        await sendEmail({
          to: user.email,
          subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1e2538; color: white; padding: 30px; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #6366f1; font-size: 24px;">VertexTrade Pro</h1>
              </div>
              <div style="background: #252d3d; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6;">Dear ${user.firstName} ${user.lastName},</p>
                <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-line;">${message}</p>
              </div>
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; text-align: center;">This email was sent from VertexTrade Pro admin panel.</p>
            </div>
          `
        });
        sent++;
      } catch(e) {}
    }

    res.json({ message: `Email sent to ${sent} users` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send bulk email', error: err.message });
  }
});

// Admin generate password reset link for user
router.post('/users/:id/reset-password', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.findByIdAndUpdate(req.params.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${user.email}`;

    res.json({ 
      success: true, 
      resetLink,
      message: 'Reset link generated. Valid for 1 hour. Copy and send to user manually.',
      expiresAt: resetExpires
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
