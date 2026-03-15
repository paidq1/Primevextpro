const Stake = require('../models/Stake');
const User = require('../models/User');
const Notification = require('../models/Notification');
const sendEmail = require('./sendEmail');

const processStakeProfits = async () => {
  try {
    const now = new Date();
    const activeStakes = await Stake.find({ status: 'active' });

    console.log(`Processing profits for ${activeStakes.length} active stakes...`);

    for (const stake of activeStakes) {
      // Check if stake has expired
      if (stake.expiresAt && now > new Date(stake.expiresAt)) {
        const user = await User.findByIdAndUpdate(
          stake.user,
          { $inc: { balance: stake.amount } },
          { new: true }
        );
        await Stake.findByIdAndUpdate(stake._id, { status: 'completed' });
        await Notification.create({
          user: stake.user,
          title: 'Stake Completed',
          message: `Your ${stake.plan} stake of $${stake.amount.toLocaleString()} has completed. Principal returned to your balance.`,
          type: 'profit'
        });
        try {
          await sendEmail({
            to: user.email,
            type: 'stakeCompleted',
            name: user.firstName,
            amount: stake.amount.toFixed(2),
            currency: user.currency,
            stakePlan: stake.plan,
            totalEarned: stake.earned?.toFixed(2) || '0',
            newBalance: user.balance.toFixed(2),
          });
        } catch(e) { console.error('Stake completed email error:', e.message); }
        console.log(`Stake ${stake._id} completed - returned $${stake.amount} to user`);
        continue;
      }

      // Random interval between 20-60 mins
      const randomIntervalMinutes = Math.floor(Math.random() * 40) + 20;
      const randomIntervalMs = randomIntervalMinutes * 60 * 1000;
      if (stake.lastProfitAt && (now - new Date(stake.lastProfitAt)) < randomIntervalMs) {
        continue;
      }

      // Calculate profit
      const annualRate = parseFloat(stake.apy) / 100;
      const dailyRate = annualRate / 365;
      const intervalRate = dailyRate / 48;
      const baseProfit = stake.amount * intervalRate;
      const variation = baseProfit * (Math.random() * 0.2 - 0.1);
      const profit = Math.max(0, parseFloat((baseProfit + variation).toFixed(4)));

      // Credit profit
      const user = await User.findByIdAndUpdate(
        stake.user,
        { $inc: { balance: profit, totalProfit: profit } },
        { new: true }
      );
      await Stake.findByIdAndUpdate(stake._id, {
        $inc: { earned: profit },
        $set: { lastProfitAt: now }
      });

      // Create notification
      await Notification.create({
        user: stake.user,
        title: 'Staking Profit Credited',
        message: `$${profit.toFixed(4)} has been credited to your account from your ${stake.plan} stake.`,
        type: 'profit'
      });

      // Send email
      try {
        await sendEmail({
          to: user.email,
          type: 'stakeProfit',
          name: user.firstName,
          amount: profit.toFixed(4),
          currency: user.currency,
          stakePlan: stake.plan,
          totalEarned: ((stake.earned || 0) + profit).toFixed(4),
          newBalance: user.balance.toFixed(2),
        });
      } catch(e) { console.error('Stake profit email error:', e.message); }

      console.log(`Staking: Credited $${profit} to user ${stake.user} for ${stake.plan} stake`);
    }
  } catch (err) {
    console.error('Stake cron error:', err.message);
  }
};

module.exports = processStakeProfits;
