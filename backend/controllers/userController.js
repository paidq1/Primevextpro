const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Trade = require('../models/Trade');
const Investment = require('../models/Investment');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    const recentTransactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const recentTrades = await Trade.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const activeInvestments = await Investment.find({ user: req.user._id, status: 'active' });

    res.json({ user, recentTransactions, recentTrades, activeInvestments });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, country } = req.body;
    const update = { firstName, lastName, phone, country };
    if (req.file) update.avatar = '/uploads/' + req.file.filename;

    const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
