const crypto = require('crypto');

function generateServerSeed() {
    const serverSeed = crypto.randomBytes(16).toString('base64'); 
    const hashedServerSeed = crypto.createHash('sha256').update(serverSeed).digest('base64'); 
    return { serverSeed, hashedServerSeed };
}

module.exports = generateServerSeed;