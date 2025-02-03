const crypto = require('crypto');

function generateServerSeed() {
    const rawServerSeed = crypto.randomBytes(8).toString('base64'); 
    const hashedServerSeed = crypto.createHash('sha256').update(rawServerSeed).digest('base64'); 
    return { rawServerSeed, hashedServerSeed };
}

module.exports = generateServerSeed;