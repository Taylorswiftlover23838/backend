const crypto = require('crypto');

function generateClientSeed() {
    return crypto.randomBytes(8).toString('base64'); 
}

module.exports = generateClientSeed;