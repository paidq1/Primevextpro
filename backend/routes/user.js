const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile, getDashboard } = require('../controllers/userController');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.get('/dashboard', auth, getDashboard);
router.put('/profile', auth, upload.single('avatar'), updateProfile);

module.exports = router;
