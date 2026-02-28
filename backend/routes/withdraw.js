const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createWithdrawal, getWithdrawals } = require('../controllers/withdrawController');

router.post('/', auth, createWithdrawal);
router.get('/', auth, getWithdrawals);

module.exports = router;
