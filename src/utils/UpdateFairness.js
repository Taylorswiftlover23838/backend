const db = require("../config/dbConn");
const getFairnessData = require("./getFairnessData");
const GenerateFairness = require("./GenerateFairness");
const getRawServerSeed = require('./getRawServerSeed')

const UpdateFairness = async (
  userId,
  hashedServerSeed,
  clientSeed,
  nonce,
  serverSeed
) => {
  try {
    const fairnessData = await getFairnessData(userId);

    const oldRawServerSeed = await getRawServerSeed(userId);
    const oldFairnessId = fairnessData.id;

    await db.query(
      "UPDATE fairness SET serverSeed = ? WHERE id = ? and user_id = ?", 
      [oldRawServerSeed, oldFairnessId, userId]
    );

    await db.query(
      "UPDATE fairness SET active = false WHERE user_id = ? and id = ?",
      [userId, oldFairnessId]
    );

    await db.query(
      "UPDATE server_seed_history SET active = false WHERE user_id = ? and id = ?",
      [userId, oldFairnessId]
    );

    await GenerateFairness(userId, hashedServerSeed, clientSeed, nonce, serverSeed);
  } catch (error) {
    console.error("Error updating fairness:", error);
  }
};

module.exports = UpdateFairness;
