const Stake = require('../models/Stake');
const User = require('../models/User');
const Notification = require('../models/Notification');

const INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

const processStakeProfits = async () => {
  try {
    const now = new Date();
    const activeStakes = await Stake.find({ status: 'active' });

    console.log(`Processing profits for ${activeStakes.length} active stakes...`);

    for (const stake of activeStakes) {
      // Check if stake has expired - return principal + notify
      if (stake.expiresAt && now > new Date(stake.expiresAt)) {
        await User.findByIdAndUpdate(stake.user, { $inc: { balance: stake.amount } });
        await Stake.findByIdAndUpdate(stake._id, { status: 'completed' });
        await Notification.create({
          user: stake.user,
          title: 'Stake Completed 🎉',
          message: `Your ${stake.plan} stake of $${stake.amount.toLocaleString()} has completed. Principal returned to your balance.`,
          type: 'profit'
        });
        console.log(`Stake ${stake._id} completed - returned $${stake.amount} to user`);
        continue;
      }

      // Prevent double crediting - skip if credited less than 25 mins ago
      if (stake.lastProfitAt && (now - new Date(stake.lastProfitAt)) < 25 * 60 * 1000) {
        console.log(`Skipping stake ${stake._id} - credited recently`);
        continue;
      }

      // Calculate profit per 30-minute interval
      const annualRate = parseFloat(stake.apy) / 100;
      const dailyRate = annualRate / 365;
      const intervalRate = dailyRate / 48;
      const baseProfit = stake.amount * intervalRate;
      const variation = baseProfit * (Math.random() * 0.2 - 0.1);
      const profit = Math.max(0, parseFloat((baseProfit + variation).toFixed(4)));

      // Credit profit to user
      await User.findByIdAndUpdate(stake.user, { $inc: { balance: profit, totalProfit: profit } });
      await Stake.findByIdAndUpdate(stake._id, { 
        $inc: { earned: profit }, 
        $set: { lastProfitAt: now } 
      });

      console.log(`Staking: Credited $${profit} to user ${stake.user} for ${stake.plan} stake`);
    }
  } catch (err) {
    console.error('Stake cron error:', err.message);
  }
};

module.exports = processStakeProfits;
