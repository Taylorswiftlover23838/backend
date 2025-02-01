const authenticateToken = require('../../../middlewares/auth/authenticateToken');
const diceHistory = require('../../../controllers/fairness/history/diceHistoryController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, diceHistory, async (req, res) => {
    
});

module.exports = router;