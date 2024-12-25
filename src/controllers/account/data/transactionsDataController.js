const db = require('../../../config/dbConn');

const transactionsData = async (req, res) => {
    const userId = req.user.userId;
    const { transactionType, page = 1 } = req.body; 

    const limit = 10; 
    const offset = (page - 1) * limit;

    try {
        let query;
        let params;

        if (transactionType === 'All') {
            query = `
                SELECT * FROM transactions 
                WHERE user_id = ? 
                ORDER BY timestamp DESC 
                LIMIT ? OFFSET ?`;
            params = [userId, Number(limit), Number(offset)];
        } else {
            query = `
                SELECT * FROM transactions 
                WHERE user_id = ? AND kind = ? 
                ORDER BY timestamp DESC 
                LIMIT ? OFFSET ?`;
            params = [userId, transactionType, Number(limit), Number(offset)];
        }

        const [data] = await db.query(query, params);

        const countQuery = transactionType === 'All'
            ? 'SELECT COUNT(*) AS transactionCount FROM transactions WHERE user_id = ?'
            : 'SELECT COUNT(*) AS transactionCount FROM transactions WHERE user_id = ? AND kind = ?';

        const [countData] = await db.query(countQuery, transactionType === 'All' ? [userId] : [userId, transactionType]);

        if (data.length > 0) {
            res.status(200).json({
                transactionCount: countData[0].transactionCount,
                transactions: data,
            });
        } else {
            res.status(200).json({
                transactionCount: 0,
                transactions: [],
                message: 'No transactions found',
            });
        }

    } catch (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = transactionsData;
