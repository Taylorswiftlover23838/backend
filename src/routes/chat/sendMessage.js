const express = require('express');
const sendMessage =  require('../../controllers/chat/messages/sendMessageController')
const authenticateToken = require('../../middlewares/auth/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, sendMessage);

module.exports = router;