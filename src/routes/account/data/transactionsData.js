const authenticateToken = require('../../../middlewares/auth/authenticateToken');
const transactionsdata = require('../../../controllers/account/data/transactionsDataController');
const express = require('express');
const router = express.Router();

router.post('/', authenticateToken, transactionsdata);

module.exports = router;
