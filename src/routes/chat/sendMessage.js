const express = require('express');
const sendMessage =  require('../../controllers/chat/sendMessageController')
const authenticateToken = require('../../middlewares/auth/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, sendMessage);

module.exports = router;