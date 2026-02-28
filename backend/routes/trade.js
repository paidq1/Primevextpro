const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createTrade, getTrades, getTradeStats } = require('../controllers/tradeController');

router.post('/', auth, createTrade);
router.get('/', auth, getTrades);
router.get('/stats', auth, getTradeStats);

module.exports = router;
