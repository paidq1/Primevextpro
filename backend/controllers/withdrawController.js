const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.createWithdrawal = async (req, res) => {
  try {
    const { amount, method, walletAddress, coin, network, accountEmail, receiverName, receiverAddress, receiverPhone, bankName, accountName, accountNumber, routingNumber } = req.body;

    if (!amount || amount < 100) return res.status(400).json({ message: 'Minimum withdrawal is $100' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.balance < parseFloat(amount)) return res.status(400).json({ message: `Insufficient balance. Your balance is $${user.balance.toFixed(2)}` });
    if (user.kycStatus !== 'approved') return res.status(400).json({ message: 'KYC verification required before withdrawing funds' });
    if (user.withdrawalBlocked) return res.status(400).json({ message: 'Your withdrawals have been temporarily suspended. Please contact support.' });
    if (!user.accountUpgraded) return res.status(400).json({ message: 'Account upgrade required before withdrawing funds. Please upgrade your account.' });
    if (user.withdrawalCodeRequired) {
      const { withdrawalCode } = req.body;
      if (!withdrawalCode) return res.status(400).json({ message: 'Withdrawal code is required. Please enter your withdrawal code.' });
      if (withdrawalCode !== user.withdrawalCode) return res.status(400).json({ message: 'Invalid withdrawal code. Please check and try again.' });
    }
    if (amount < user.minimumWithdrawal) return res.status(400).json({ message: `Minimum withdrawal is $${user.minimumWithdrawal}` });

    // Build payment details based on method
    let bankDetails = {};
    if (method === 'crypto') bankDetails = { coin, network, walletAddress };
    else if (method === 'cashapp' || method === 'paypal') bankDetails = { accountEmail };
    else if (method === 'western_union' || method === 'moneygram') bankDetails = { receiverName, receiverAddress, receiverPhone };
    else if (method === 'bank') bankDetails = { bankName, accountName, accountNumber, routingNumber };

    // Deduct balance immediately
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { balance: -parseFloat(amount), totalWithdrawals: parseFloat(amount) }
    });

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'withdrawal',
      amount: parseFloat(amount),
      method,
      walletAddress: method === 'crypto' ? walletAddress : '',
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
