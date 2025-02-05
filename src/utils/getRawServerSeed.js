const db = require('../config/dbConn')

const getRawServerSeed = async (userId) => {
    const results = await db.query("SELECT * FROM server_seed_history WHERE active = true AND user_id = ?",[userId]);
    return results[0][0].serverSeed;
}

module.exports = getRawServerSeed;