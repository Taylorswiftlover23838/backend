const db = require('../../../config/dbConn');

const fetchAllMessagesFromDB = async () => {
    try {
        const [results] = await db.query('SELECT * FROM messages');
        return results;
    } catch (err) {
        console.error('Error while fetching messages:', err);
        throw new Error("Error fetching messages");
    }
}

module.exports = fetchAllMessagesFromDB;