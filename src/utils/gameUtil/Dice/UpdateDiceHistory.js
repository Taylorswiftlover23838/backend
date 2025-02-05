const db = require("../../../config/dbConn")

const UpdateDiceFairness = async (betAmount, fairness_id, rangeValue, rollType, roll, nonce, won, user_id) => {

    try {
        await db.query(
            "INSERT INTO dice (betAmount, fairness_id, rangeValue, rollType, roll, nonce, won, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [betAmount, fairness_id, rangeValue, rollType, roll, nonce, won, user_id]
          );
    } catch(error) {
        console.error("Database Error:", error);
    }
}

module.exports = UpdateDiceFairness;