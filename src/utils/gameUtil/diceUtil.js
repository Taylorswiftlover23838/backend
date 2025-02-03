const crypto = require("crypto");

const getDiceRoll = (rawServerSeed, clientSeed, nonce) => {
    const seed = `${rawServerSeed}-${clientSeed}-${nonce}`;
    const hash = crypto.createHmac("sha256", seed).digest("hex");
    const subHash = hash.substring(0, 8);
    const rollNumber = Number.parseInt(subHash, 16);
    return (rollNumber % 10001) / 100;
  };

module.exports = getDiceRoll;