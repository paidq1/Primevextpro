const Bot = require('../models/Bot');
const User = require('../models/User');

const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

const processBotProfits = async () => {
  try {
    const now = new Date();
    const activeBots = await Bot.find({ status: 'active' });
    
    console.log(`Processing profits for ${activeBots.length} active bots...`);

    for (const bot of activeBots) {
      // Check if bot has expired
      if (bot.expiresAt && now > new Date(bot.expiresAt)) {
        await Bot.findByIdAndUpdate(bot._id, { status: 'completed' });
        console.log(`Bot ${bot._id} completed`);
        continue;
      }

      // Prevent double crediting - skip if credited less than 25 mins ago
      if (bot.lastProfitAt && (now - new Date(bot.lastProfitAt)) < 25 * 60 * 1000) {
        console.log(`Skipping bot ${bot._id} - credited recently`);
        continue;
      }

      // Calculate profit per 30-minute interval with slight randomness (+/- 10%)
      const dailyRate = parseFloat(bot.dailyRate) / 100;
      const intervalRate = dailyRate / 48;
      const baseProfit = bot.amount * intervalRate;
      const variation = baseProfit * (Math.random() * 0.2 - 0.1);
      const profit = Math.max(0, parseFloat((baseProfit + variation).toFixed(2)));

      // Credit profit to user balance and bot earned
      await User.findByIdAndUpdate(bot.user, { $inc: { balance: profit, totalProfit: profit } });
      await Bot.findByIdAndUpdate(bot._id, { $inc: { earned: profit }, $set: { lastProfitAt: now } });

      console.log(`Credited $${profit} to user ${bot.user} for bot ${bot.botName}`);
    }
  } catch (err) {
    console.error('Bot cron error:', err.message);
  }
};

module.exports = processBotProfits;
