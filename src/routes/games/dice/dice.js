const authenticateToken = require('../../../middlewares/auth/authenticateToken');
const dice = require('../../../controllers/games/dice/diceController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, dice, async (req, res) => {
    
});

module.exports = router;