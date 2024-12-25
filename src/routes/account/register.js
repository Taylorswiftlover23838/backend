const express = require('express');
const register = require('../../controllers/account/registerController')

const router = express.Router();

router.post('/', register);

module.exports = router;