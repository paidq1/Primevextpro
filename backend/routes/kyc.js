const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitKyc, getKycStatus } = require('../controllers/kycController');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

router.post('/', auth, upload.fields([{ name: 'idFront' }, { name: 'idBack' }, { name: 'selfie' }]), submitKyc);
router.get('/', auth, getKycStatus);

module.exports = router;
