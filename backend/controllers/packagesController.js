const Investment = require('../models/Investment');
const User = require('../models/User');

exports.joinPlan = async (req, res) => {
  try {
    const { plan, amount, roi, duration } = req.body;
    const user = await User.findById(req.user._id);

    if (user.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

    const durationDays = parseInt(duration);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationDays);

    const investment = await Investment.create({
      user: req.user._id, plan, amount: parseFloat(amount), roi, duration, expiresAt,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { balance: -parseFloat(amount) } });

    res.status(201).json({ message: 'Investment plan joined successfully', investment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
