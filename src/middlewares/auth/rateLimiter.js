const rateLimit = require('express-rate-limit');

const recoveryCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3, 
    message: {
        message: "Too many requests. Please try again after 15 minutes",
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

module.exports = {
    recoveryCodeLimiter,
};