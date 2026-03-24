const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const Trader = require('../models/Trader');
const adminAuth = require('../middleware/adminAuth');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get all traders (public)
router.get('/', async (req, res) => {
  try {
    const traders = await Trader.find().sort({ order: 1, createdAt: 1 });
    res.json(traders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add trader (admin)
router.post('/', adminAuth, upload.single('img'), async (req, res) => {
  try {
    let imgUrl = '';
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'traders' });
      imgUrl = result.secure_url;
    }
    const trader = await Trader.create({ ...req.body, img: imgUrl });
    res.json(trader);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update trader (admin)
router.put('/:id', adminAuth, upload.single('img'), async (req, res) => {
  try {
    let update = { ...req.body };
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      const result = await cloudinary.uploader.upload(dataURI, { folder: 'traders' });
      update.img = result.secure_url;
    }
    const trader = await Trader.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(trader);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete trader (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    await Trader.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
