const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createDeposit, getDeposits } = require('../controllers/depositController');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', auth, upload.single('proof'), createDeposit);
router.get('/', auth, getDeposits);

module.exports = router;
