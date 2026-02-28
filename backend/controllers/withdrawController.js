const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.createWithdrawal = async (req, res) => {
  try {
    const { amount, method, walletAddress, bankDetails } = req.body;
    if (!amount || amount < 10) return res.status(400).json({ message: 'Minimum withdrawal is $10' });

    const user = await User.findById(req.user._id);
    if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'withdrawal',
      amount: parseFloat(amount),
      method,
      walletAddress,
      bankDetails,
      status: 'pending',
    });

    res.status(201).json({ message: 'Withdrawal request submitted', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ user: req.user._id, type: 'withdrawal' }).sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
