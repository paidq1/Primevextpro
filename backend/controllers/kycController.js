const User = require('../models/User');

exports.submitKyc = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { kycStatus: 'submitted' });
    res.json({ message: 'KYC submitted successfully. Under review.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getKycStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('kycStatus');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
