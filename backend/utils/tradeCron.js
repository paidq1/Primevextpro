const Trade = require('../models/Trade');
const User = require('../models/User');
const Notification = require('../models/Notification');

const processTrades = async () => {
  try {
    const now = new Date();
    const expiredTrades = await Trade.find({ status: 'active', expiresAt: { $lte: now } });

    console.log(`Processing ${expiredTrades.length} expired trades...`);

    for (const trade of expiredTrades) {
      // Admin-set result takes priority, otherwise simulate
      let result = trade.result || 0;
      if (result === 0) {
        // Random outcome: 55% win, 45% loss (slight house edge)
        const isWin = Math.random() < 0.65;
        const leverageMultiplier = parseFloat(trade.leverage) || 1;
        const profitPct = (Math.random() * 0.15 + 0.05) * leverageMultiplier; // 5-20% * leverage
        result = isWin ? parseFloat((trade.amount * profitPct).toFixed(2)) : -parseFloat((trade.amount * (Math.random() * 0.1 + 0.05)).toFixed(2));
      }

      const payout = trade.amount + result;
      const closePrice = parseFloat((trade.openPrice * (1 + (result > 0 ? 0.01 : -0.01))).toFixed(4));

      await Trade.findByIdAndUpdate(trade._id, {
        status: 'closed',
        result,
        closePrice,
        closedAt: now,
        profitLoss: result,
      });

      // Return payout to real account
      if (trade.account === 'real' && payout > 0) {
        await User.findByIdAndUpdate(trade.user, { $inc: { balance: payout, totalProfit: result > 0 ? result : 0 } });
      }

      // Notify user
      await Notification.create({
        user: trade.user,
        title: result > 0 ? `Trade Won! +$${result.toFixed(2)} 🎉` : `Trade Closed -$${Math.abs(result).toFixed(2)}`,
        message: `Your ${trade.type.toUpperCase()} trade on ${trade.symbol} has closed. ${result > 0 ? `Profit: +$${result.toFixed(2)}` : `Loss: -$${Math.abs(result).toFixed(2)}`}`,
        type: result > 0 ? 'profit' : 'system',
      });

      console.log(`Trade ${trade._id} closed: ${result > 0 ? 'WIN' : 'LOSS'} $${result}`);
    }
  } catch (err) {
    console.error('Trade cron error:', err.message);
  }
};

module.exports = processTrades;
