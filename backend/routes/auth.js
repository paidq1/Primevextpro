const express = require('express');
const router = express.Router();
const { register, login, getMe, changePassword, verifyEmail, resendVerification } = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.get('/me', auth, getMe);
router.put('/change-password', auth, changePassword);

module.exports = router;
