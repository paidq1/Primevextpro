const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile, getDashboard } = require('../controllers/userController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.get('/dashboard', auth, getDashboard);
router.put('/profile', auth, upload.single('avatar'), updateProfile);

module.exports = router;
