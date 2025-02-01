const authenticateToken = require('../../../middlewares/auth/authenticateToken');
const blackjackHistory = require('../../../controllers/fairness/history/blackjackHistoryController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, blackjackHistory, async (req, res) => {
    
});

module.exports = router;