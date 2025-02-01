const crypto = require('crypto');

function generateClientSeed() {
    return crypto.randomBytes(8).toString('hex'); 
}

module.exports = generateClientSeed;