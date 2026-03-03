const { uploadToCloudinary } = require('../utils/cloudinary');
const User = require('../models/User');

exports.submitKyc = async (req, res) => {
  try {
    const { idType, idNumber } = req.body;

    if (!idType || !idNumber) {
      return res.status(400).json({ message: 'ID type and number are required.' });
    }

    if (!req.files || !req.files.idFront || !req.files.idBack || !req.files.selfie) {
      return res.status(400).json({ message: 'All documents are required.' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      kycStatus: 'submitted',
      kycData: {
        idType,
        idNumber,
        idFront: '/uploads/' + req.files.idFront[0].filename,
        idBack: '/uploads/' + req.files.idBack[0].filename,
        selfie: '/uploads/' + req.files.selfie[0].filename,
        submittedAt: new Date(),
      },
    });

    res.json({ message: 'KYC submitted successfully. Under review.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getKycStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('kycStatus kycData');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
