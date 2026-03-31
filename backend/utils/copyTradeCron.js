require('dotenv').config();
const mongoose = require('mongoose');
const CopyTrade = require('../models/CopyTrade');
const User = require('../models/User');
const Trader = require('../models/Trader');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');

const processCopyTradeProfits = async () => {
  try {
    // Ensure database is connected
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MongoDB URI not found in environment variables');
      }
      console.log('Connecting to MongoDB...');
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');
    }
    
    const now = new Date();
    const activeTrades = await CopyTrade.find({ status: 'active' });
    console.log(`Processing copy trade profits for ${activeTrades.length} active copies...`);

    if (activeTrades.length === 0) {
      console.log('No active copy trades found');
      return;
    }

    for (const trade of activeTrades) {
      try {
        // Run every 4-8 hours randomly
        const randomIntervalMs = (Math.floor(Math.random() * 4) + 4) * 60 * 60 * 1000;
        if (trade.lastProfitAt && (now - new Date(trade.lastProfitAt)) < randomIntervalMs) {
          console.log(`Skipping ${trade.traderName} - too soon since last profit`);
          continue;
        }

        // Fetch trader data to get winRate and risk
        // Auto-stop if end date passed
        if (trade.endDate && now > new Date(trade.endDate)) {
          await CopyTrade.findByIdAndUpdate(trade._id, { status: 'stopped' });
          await Notification.create({ user: trade.user, title: 'Copy Trade Ended', message: `Your copy trade with ${trade.traderName} has ended as scheduled.`, type: 'system' });
          console.log(`⏹ ${trade.traderName} auto-stopped - end date reached`);
          continue;
        }
        const trader = await Trader.findById(trade.trader);
        const winRate = trader ? trader.winRate : 70;
        const risk = trader ? trader.risk : 5;
        const profitShare = trade.profitShare || 20;

        // Simulate win or loss based on win rate
        const isWin = Math.random() * 100 < winRate;

        let profitAmount = 0;
        if (isWin) {
          // Profit: 1-4% of investment based on risk
          const profitPct = (Math.random() * 3 + 1) * (risk / 10);
          const grossProfit = trade.amount * (profitPct / 100);
          const traderCommission = grossProfit * (profitShare / 100);
          profitAmount = parseFloat((grossProfit - traderCommission).toFixed(2));
          console.log(`✅ ${trade.traderName}: WIN - Profit: $${profitAmount}`);
        } else {
          // Loss: 0.5-2% of investment
          const lossPct = Math.random() * 1.5 + 0.5;
          profitAmount = -parseFloat((trade.amount * (lossPct / 100)).toFixed(2));
          console.log(`❌ ${trade.traderName}: LOSS - Loss: $${Math.abs(profitAmount)}`);
        }

        if (profitAmount === 0) continue;

        // Update user balance
        const user = await User.findByIdAndUpdate(
          trade.user,
          { $inc: { balance: profitAmount, totalProfit: profitAmount > 0 ? profitAmount : 0 } },
          { new: true }
        );

        // Update copy trade
        const updatedTrade = await CopyTrade.findByIdAndUpdate(trade._id, {
          $inc: { totalEarned: profitAmount },
          $set: { lastProfitAt: now }
        }, { new: true });

        console.log(`💰 Copy trade: ${profitAmount > 0 ? '+' : ''}$${profitAmount} for ${trade.traderName}. Total earned: $${updatedTrade.totalEarned}`);

        // Create notification
        try {
          await Notification.create({
            user: trade.user,
            title: profitAmount > 0 ? 'Copy Trade Profit' : 'Copy Trade Loss',
            message: profitAmount > 0
              ? `$${profitAmount.toFixed(2)} profit credited from copying ${trade.traderName}.`
              : `$${Math.abs(profitAmount).toFixed(2)} loss from copying ${trade.traderName}.`,
            type: profitAmount > 0 ? 'profit' : 'system'
          });
        } catch(e) { 
          console.error('Copy trade notification error:', e.message); 
        }

        // Send email for profits only
        try {
          if (profitAmount > 0 && user && user.email) {
            await sendEmail({
              to: user.email,
              type: 'botProfit',
              name: user.firstName || 'User',
              amount: profitAmount.toFixed(2),
              currency: user.currency || 'USD',
              botName: `Copy Trading (${trade.traderName})`,
              totalEarned: updatedTrade.totalEarned.toFixed(2),
              newBalance: user.balance.toFixed(2),
            });
          }
        } catch(e) { 
          console.error('Copy trade email error:', e.message); 
        }
        
      } catch (tradeErr) {
        console.error(`Error processing trade ${trade._id}:`, tradeErr.message);
      }
    }
    
    console.log('Copy trade processing completed');
  } catch (err) {
    console.error('Copy trade cron error:', err.message);
    console.error(err.stack);
  }
};

module.exports = processCopyTradeProfits;
