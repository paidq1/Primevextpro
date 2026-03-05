const Trade = require('../models/Trade');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Parse duration string to milliseconds
const parseDuration = (duration) => {
  const map = {
    '30 seconds': 30 * 1000,
    '1 minute': 60 * 1000,
    '2 minutes': 2 * 60 * 1000,
    '5 minutes': 5 * 60 * 1000,
    '10 minutes': 10 * 60 * 1000,
    '15 minutes': 15 * 60 * 1000,
    '30 minutes': 30 * 60 * 1000,
    '1 hour': 60 * 60 * 1000,
  };
  return map[duration] || 60 * 1000;
};

exports.createTrade = async (req, res) => {
  try {
    const { account, market, symbol, type, amount, leverage, duration, stopLoss, takeProfit } = req.body;
    if (!amount || amount < 10) return res.status(400).json({ message: 'Minimum trade amount is $10' });

    const user = await User.findById(req.user._id);
    if (account === 'real' && user.balance < parseFloat(amount)) {
      return res.status(400).json({ message: `Insufficient balance. Your balance is $${user.balance.toFixed(2)}` });
    }

    // Simulate open price (random realistic price per symbol)
    const prices = {
      'BTC/USD': 65000 + Math.random() * 5000,
      'ETH/USD': 3200 + Math.random() * 300,
      'XRP/USD': 0.5 + Math.random() * 0.1,
      'SOL/USD': 140 + Math.random() * 20,
      'BNB/USD': 580 + Math.random() * 40,
      'ADA/USD': 0.45 + Math.random() * 0.05,
      'DOGE/USD': 0.12 + Math.random() * 0.02,
      'AVAX/USD': 35 + Math.random() * 5,
      'EUR/USD': 1.08 + Math.random() * 0.01,
      'GBP/USD': 1.27 + Math.random() * 0.01,
      'USD/JPY': 149 + Math.random() * 2,
      'AAPL': 175 + Math.random() * 10,
      'TSLA': 175 + Math.random() * 15,
      'NVDA': 875 + Math.random() * 50,
      'MSFT': 415 + Math.random() * 20,
      'AMZN': 185 + Math.random() * 10,
    };
    const openPrice = parseFloat((prices[symbol] || 100 + Math.random() * 50).toFixed(4));
    const expiresAt = new Date(Date.now() + parseDuration(duration));

    const trade = await Trade.create({
      user: req.user._id,
      account, market, symbol, type,
      amount: parseFloat(amount),
      leverage, duration,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      openPrice,
      expiresAt,
      status: 'active',
    });

    // Deduct amount from balance for real accounts
    if (account === 'real') {
      await User.findByIdAndUpdate(req.user._id, { $inc: { balance: -parseFloat(amount) } });
    }

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
    res.json({ totalTrades, closedTrades: closedTrades.length, wins: wins.length, losses: losses.length, totalProfit: totalProfit.toFixed(2), totalLoss: totalLoss.toFixed(2), netProfitLoss: netProfitLoss.toFixed(2), roi });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
