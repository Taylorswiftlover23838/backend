const authenticateToken = require('../../../middlewares/auth/authenticateToken');
const minesHistory = require('../../../controllers/fairness/history/minesHistoryController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, minesHistory, async (req, res) => {
    
});

module.exports = router;