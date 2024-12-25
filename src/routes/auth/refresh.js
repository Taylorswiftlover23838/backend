const express = require('express');
const refreshtoken = require('../../controllers/auth/refreshtokenController')

const router = express.Router();

router.post('/', refreshtoken);

module.exports = router;