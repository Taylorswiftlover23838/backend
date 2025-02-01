const db = require("../config/dbConn");

const getUserData = async (userId) => {
    const [results] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (results.length === 0) {
      throw new Error("User not found");
    }
    return results[0];
  };

module.exports = getUserData;
  