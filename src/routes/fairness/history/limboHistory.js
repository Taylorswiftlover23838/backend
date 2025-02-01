const authenticateToken = require('../../../middlewares/auth/authenticateToken');
const limboHistory = require('../../../controllers/fairness/history/limboHistoryController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, limboHistory, async (req, res) => {
    
});

module.exports = router;