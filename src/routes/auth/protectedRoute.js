const authenticateToken = require('../../middlewares/auth/authenticateToken');
const protectedRoute = require('../../controllers/auth/protectedRouteController')
const express = require('express');
const router = express.Router();

router.get('/', authenticateToken, protectedRoute);

module.exports = router;