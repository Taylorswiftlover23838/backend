const authenticateToken = require('../../middlewares/auth/authenticateToken');
const express = require('express');
const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    const userId = req.user.userId; 
    res.status(200).json({ message: "You have access!", userId });
});

module.exports = router;