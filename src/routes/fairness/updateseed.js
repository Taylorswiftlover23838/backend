const authenticateToken = require('../../middlewares/auth/authenticateToken');
const updateSeed = require('../../controllers/fairness/updateseedController')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, updateSeed, async (req, res) => {
    
});

module.exports = router;