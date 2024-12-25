const authenticateToken = require('../../../middlewares/auth/authenticateToken');
const userdata = require('../../../controllers/account/data/userDataController')
const express = require('express');
const router = express.Router();

router.get('/', authenticateToken, userdata);

module.exports = router;