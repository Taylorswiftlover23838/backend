const authenticateToken = require('../../middlewares/auth/authenticateToken');
const promocode = require('../../controllers/promocode/promocodeController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, promocode, async (req, res) => {
    
});

module.exports = router;