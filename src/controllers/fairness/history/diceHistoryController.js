const db = require("../../../config/dbConn");

const diceHistory = async (req, res) => {
  const userId = req.user.userId;

  const { date } = req.body
  
  try {
    const [diceHistoryData] = await db.query("SELECT * FROM dice WHERE user_id = ? AND DATE(timestamp) = ?",[userId, date]);
    const [fairnessData] = await db.query("SELECT * FROM fairness WHERE user_id = ? AND DATE(timestamp) = ?",[userId, date]);
    const activeFairnessData = await db.query("SELECT * FROM fairness WHERE user_id = ? and active = true", [userId])
    const currentClientSeed = activeFairnessData[0][0].clientSeed

    const fairnessMap = {};
    fairnessData.forEach(fairness => {
      fairnessMap[fairness.id] = {
        _id: fairness.id,
        userId: fairness.user_id,
        serverSeed: fairness.serverSeed,
        clientSeed: fairness.clientSeed,
        active: fairness.active,
        nonce: fairness.nonce,
        timestamp: fairness.timestamp,
      };
    });

    const formattedData = diceHistoryData.map(dice => ({
      _id: dice.id.toString(),
      betAmount: parseFloat(dice.betAmount),
      fairnessId: dice.fairness_id,
      rangeValue: parseFloat(dice.rangeValue),
      rollType: dice.rollType,
      roll: parseFloat(dice.roll),
      nonce: dice.nonce,
      won: dice.won === 1, 
      userId: dice.user_id.toString(),
      timestamp: dice.timestamp,
      fairness: fairnessMap[dice.fairness_id], 
    }));

    res.status(200).json({rolls: formattedData, clientSeed: currentClientSeed});
  } catch (error) {
    console.error("Error fetching dice history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = diceHistory;
