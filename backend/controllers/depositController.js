const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.createDeposit = async (req, res) => {
  try {
    const { amount, method } = req.body;
    if (!amount || amount < 10) return res.status(400).json({ message: 'Minimum deposit is $10' });

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'deposit',
      amount: parseFloat(amount),
      method,
      status: 'pending',
      proofImage: req.file ? (await uploadToCloudinary(req.file, 'vertextrade/proofs')).secure_url : '',
    });

    res.status(201).json({ message: 'Deposit submitted successfully', transaction });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDeposits = async (req, res) => {
  try {
    const deposits = await Transaction.find({ user: req.user._id, type: 'deposit' }).sort({ createdAt: -1 });
    res.json(deposits);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
