const crypto = require('crypto');

const generateRandomCode = () => {
    return crypto.randomInt(100000, 1000000).toString();
};

module.exports = generateRandomCode;