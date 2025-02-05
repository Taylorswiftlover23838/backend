const db = require("../../../config/dbConn");

const limboHistory = async (req, res) => {
  const userId = req.user.userId;

  const { date } = req.body;

  try {
    const activeFairnessData = await db.query("SELECT * FROM fairness WHERE user_id = ? and active = true", [userId])
    const currentClientSeed = activeFairnessData[0][0].clientSeed

    res.status(200).json({rolls: [], clientSeed: currentClientSeed});
  } catch (error) {
    
  }

}

module.exports =  limboHistory;