const express = require('express');
const sendRecoveryCode =  require('../../controllers/email/recoverycodeController')
const { recoveryCodeLimiter } = require('../../middlewares/auth/rateLimiter')

const router = express.Router();

router.post('/',  sendRecoveryCode);

module.exports = router;