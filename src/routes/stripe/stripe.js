const authenticateToken = require('../../middlewares/auth/authenticateToken');
const createCheckOutSession = require('../../controllers/stripe/stripecontroller')
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, createCheckOutSession, async (req, res) => {
    
});

module.exports = router;