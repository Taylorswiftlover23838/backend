const express = require('express');
const resetPassword =  require('../../controllers/account/resetPasswordController')

const router = express.Router();

router.post('/', resetPassword);

module.exports = router;