const crypto = require('crypto');

function generateClientSeed() {
    return crypto.randomBytes(16).toString('base64'); 
}

module.exports = generateClientSeed;