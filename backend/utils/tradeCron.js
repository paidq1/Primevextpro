const Trade = require('../models/Trade');
const User = require('../models/User');
const Notification = require('../models/Notification');

const processTrades = async () => {
  try {
    const now = new Date();
    const expiredTrades = await Trade.find({ status: 'active', expiresAt: { $lte: now } });

    console.log(`Processing ${expiredTrades.length} expired trades...`);

    for (const trade of expiredTrades) {
      let result = trade.result || 0;

      if (result === 0) {
        // 68% win rate (favorable for users)
        const isWin = Math.random() < 0.68;
        const leverageMultiplier = parseFloat(trade.leverage) || 1;

        if (isWin) {
          // Win: 8-25% profit * leverage
          const profitPct = (Math.random() * 0.17 + 0.08) * leverageMultiplier;
          result = parseFloat((trade.amount * Math.min(profitPct, 2.0)).toFixed(2)); // cap at 200%
        } else {
          // Loss: 5-15% loss (softer losses)
          const lossPct = Math.random() * 0.10 + 0.05;
          result = -parseFloat((trade.amount * lossPct).toFixed(2));
        }
      }

      const payout = result > 0 ? trade.amount + result : 0;
      const closePrice = parseFloat((trade.openPrice * (1 + (result > 0 ? 0.012 : -0.008))).toFixed(4));

      await Trade.findByIdAndUpdate(trade._id, {
        status: 'closed',
        result,
        closePrice,
        closedAt: now,
        profitLoss: result,
      });

      // Return payout to real account balance
      if (trade.account === 'real' && payout > 0) {
        await User.findByIdAndUpdate(trade.user, {
          $inc: { balance: payout, totalProfit: result > 0 ? result : 0 }
        });
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
