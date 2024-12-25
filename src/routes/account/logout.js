const express = require('express');
const logout = require('../../controllers/account/logoutController')

const router = express.Router();

router.post('/', logout);

module.exports = router;