const Trade = require('../models/Trade');

exports.createTrade = async (req, res) => {
  try {
    const { account, market, symbol, type, amount, leverage, duration } = req.body;
    if (!amount || amount < 10) return res.status(400).json({ message: 'Minimum trade amount is $10' });

    const trade = await Trade.create({
      user: req.user._id,
      account, market, symbol, type, amount: parseFloat(amount), leverage, duration,
    });

    res.status(201).json({ message: 'Trade placed successfully', trade });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trades);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
