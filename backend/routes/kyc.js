const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { submitKyc, getKycStatus } = require('../controllers/kycController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', auth, upload.fields([{ name: 'idFront' }, { name: 'idBack' }, { name: 'selfie' }]), submitKyc);
router.get('/', auth, getKycStatus);

module.exports = router;
