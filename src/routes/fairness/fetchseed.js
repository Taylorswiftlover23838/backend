const authenticateToken = require('../../middlewares/auth/authenticateToken');
const fetchSeed = require('../../controllers/fairness/fetchseedController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, fetchSeed, async (req, res) => {
    
});

module.exports = router;