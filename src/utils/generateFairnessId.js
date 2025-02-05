const crypto = require('crypto');

function generateFairnessId(serverSeed) {
  const hash = crypto.createHash('sha256').update(serverSeed).digest('hex');
  
  return hash;
}

module.exports = generateFairnessId;