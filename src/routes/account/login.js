const express = require('express');
const login =  require('../../controllers/account/loginController')

const router = express.Router();

router.post('/', login);

module.exports = router;