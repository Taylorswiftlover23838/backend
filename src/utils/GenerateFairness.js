const db = require("../config/dbConn");
const generateFairnessId = require("./generateFairnessId");

const GenerateFairness = async (
  userId,
  hashedServerSeed,
  clientSeed,
  nonce,
  serverSeed
) => {
  try {
    const FairnessId = generateFairnessId(hashedServerSeed);

    await db.query(
      "INSERT INTO fairness (id, user_id, serverSeed, clientSeed, active, nonce) VALUES (?, ?, ?, ?, ?, ?)",
      [FairnessId, userId, hashedServerSeed, clientSeed, true, nonce]
    );

    await db.query(
      "INSERT INTO server_seed_history (id, user_id, serverSeed, active) VALUES (?, ?, ?, ?)",
      [FairnessId, userId, serverSeed, true]
    );
  } catch (error) {
    console.error("Error generating fairness:", error);
  }
};

module.exports = GenerateFairness;
