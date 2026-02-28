const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { joinPlan, getInvestments } = require('../controllers/packagesController');

router.post('/', auth, joinPlan);
router.get('/', auth, getInvestments);

module.exports = router;
