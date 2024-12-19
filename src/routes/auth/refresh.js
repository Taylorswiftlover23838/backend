const express = require('express');
const refreshtoken = require('../../controllers/auth/refreshtokencontroller')

const router = express.Router();

router.post('/', refreshtoken);

module.exports = router;