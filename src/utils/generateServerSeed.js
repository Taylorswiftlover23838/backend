const crypto = require('crypto');

function generateServerSeed() {
    const rawSeed = crypto.randomBytes(8).toString('hex'); 
    const hashedSeed = crypto.createHash('sha256').update(rawSeed).digest('base64'); 
    return hashedSeed;
}

module.exports = generateServerSeed;