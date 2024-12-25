const express = require('express');
const sendRecoveryCode =  require('../../controllers/account/recoveryCodeController')
const { recoveryCodeLimiter } = require('../../middlewares/auth/rateLimiter')

const router = express.Router();

router.post('/', recoveryCodeLimiter, sendRecoveryCode);

module.exports = router;