const Trade = require('../models/Trade');
const User = require('../models/User');

exports.createTrade = async (req, res) => {
  try {
    const { account, market, symbol, type, amount, leverage, duration } = req.body;
    if (!amount || amount < 10) return res.status(400).json({ message: 'Minimum trade amount is $10' });

    const user = await User.findById(req.user._id);
    if (account === 'real' && user.balance < parseFloat(amount)) {
      return res.status(400).json({ message: `Insufficient balance. Your balance is $${user.balance.toFixed(2)}` });
    }

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

exports.getTradeStats = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id });

    const totalTrades = trades.length;
    const closedTrades = trades.filter(t => t.status === 'closed');
    const wins = closedTrades.filter(t => t.result > 0);
    const losses = closedTrades.filter(t => t.result < 0);

    const totalProfit = closedTrades.reduce((sum, t) => sum + (t.result > 0 ? t.result : 0), 0);
    const totalLoss = closedTrades.reduce((sum, t) => sum + (t.result < 0 ? Math.abs(t.result) : 0), 0);
    const netProfitLoss = closedTrades.reduce((sum, t) => sum + t.result, 0);

    const totalInvested = closedTrades.reduce((sum, t) => sum + t.amount, 0);
    const roi = totalInvested > 0 ? ((netProfitLoss / totalInvested) * 100).toFixed(2) : 0;

    res.json({
      totalTrades,
      closedTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      totalProfit: totalProfit.toFixed(2),
      totalLoss: totalLoss.toFixed(2),
      netProfitLoss: netProfitLoss.toFixed(2),
      roi,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
