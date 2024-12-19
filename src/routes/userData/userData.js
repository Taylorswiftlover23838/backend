const authenticateToken = require('../../middlewares/auth/authenticateToken');
const userdata = require('../../controllers/data/userData/userdataController')
const express = require('express');
const router = express.Router();

router.get('/', authenticateToken, userdata);

module.exports = router;