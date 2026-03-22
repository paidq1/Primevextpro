const Investment = require('../models/Investment');
const User = require('../models/User');
const Notification = require('../models/Notification');

const processInvestments = async () => {
  try {
    const now = new Date();
    const activeInvestments = await Investment.find({ status: 'active' });

    for (const inv of activeInvestments) {
      const roiPercent = parseFloat(inv.roi) / 100;
      const durationDays = parseInt(inv.duration);
      const dailyProfit = (inv.amount * roiPercent) / durationDays;

      // Credit daily profit
      await Investment.findByIdAndUpdate(inv._id, {
        $inc: { earned: dailyProfit, profit: dailyProfit }
      });

      await User.findByIdAndUpdate(inv.user, {
        $inc: { balance: dailyProfit, totalProfit: dailyProfit }
      });

      // Check if investment has expired
      if (now >= new Date(inv.expiresAt)) {
        await Investment.findByIdAndUpdate(inv._id, { status: 'completed' });

        await Notification.create({
          user: inv.user,
          title: `Investment Completed! 🎉`,
          message: `Your ${inv.plan} plan has matured. Principal and profits have been credited.`,
          type: 'profit',
        });

        // Return principal
        await User.findByIdAndUpdate(inv.user, {
          $inc: { balance: inv.amount }
        });
      }
    }

    if (activeInvestments.length > 0) {
      console.log(`Processed ${activeInvestments.length} investments`);
    }
  } catch (err) {
    console.error('Investment cron error:', err.message);
  }
};

module.exports = processInvestments;
