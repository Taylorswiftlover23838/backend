const crypto = require('crypto');

const generateRecoveryCode = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

module.exports = generateRecoveryCode;