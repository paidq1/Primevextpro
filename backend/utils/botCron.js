const Bot = require('../models/Bot');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');

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

      // Random interval between 15 mins and 3 hours
      const randomIntervalMinutes = Math.floor(Math.random() * 45) + 15;
      const randomIntervalMs = randomIntervalMinutes * 60 * 1000;

      // Skip if credited too recently based on random interval
      if (bot.lastProfitAt && (now - new Date(bot.lastProfitAt)) < randomIntervalMs) {
        continue;
      }

      // Calculate total profit (5x investment) and daily profit
      const totalProfit = bot.amount * 5;
      const dailyProfit = totalProfit / bot.days;

      // Split daily profit into random increments (between 3-8 credits per day)
      const creditsPerDay = Math.floor(Math.random() * 6) + 3;
      const baseProfit = dailyProfit / creditsPerDay;
      const variation = baseProfit * (Math.random() * 0.2 - 0.1);
      const profit = Math.max(0.01, parseFloat((baseProfit + variation).toFixed(2)));

      // Don't exceed remaining profit
      const remaining = totalProfit - (bot.earned || 0);
      if (remaining <= 0) {
        await Bot.findByIdAndUpdate(bot._id, { status: 'completed' });
        continue;
      }
      const finalProfit = Math.min(profit, remaining);

      // Credit profit to user
      const user = await User.findByIdAndUpdate(
        bot.user,
        { $inc: { balance: finalProfit, totalProfit: finalProfit } },
        { new: true, returnDocument: 'after' }
      );
      await Bot.findByIdAndUpdate(bot._id, {
        $inc: { earned: finalProfit },
        $set: { lastProfitAt: now }
      });

      console.log(`Credited $${finalProfit} to user ${bot.user} for bot ${bot.botName}`);

      // Create notification
      try {
        await Notification.create({
          user: bot.user,
          title: 'Bot Profit Credited',
          message: `$${finalProfit.toFixed(2)} has been credited to your account from your ${bot.botName}.`,
          type: 'profit'
        });
      } catch(e) { console.error('Bot notification error:', e.message); }

      // Send email notification
      try {
        await sendEmail({
          to: user.email,
          type: 'botProfit',
          name: user.firstName,
          amount: finalProfit.toFixed(2),
          currency: user.currency,
          botName: bot.botName,
          totalEarned: ((bot.earned || 0) + finalProfit).toFixed(2),
          newBalance: user.balance.toFixed(2),
        });
      } catch (emailErr) {
        console.error('Bot profit email error:', emailErr.message);
      }
    }
  } catch (err) {
    console.error('Bot cron error:', err.message);
  }
};

module.exports = processBotProfits;
