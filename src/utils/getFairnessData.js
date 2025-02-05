const db = require("../config/dbConn");

const getFairnessData = async (userId) => {
    const [results] = await db.query("SELECT * FROM fairness WHERE user_id = ? AND active = true", [userId]);
    if (results.length === 0) {
      throw new Error("User not found");
    }
    return results[0];
};

module.exports = getFairnessData;
