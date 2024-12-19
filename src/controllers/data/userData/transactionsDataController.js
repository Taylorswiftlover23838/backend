const db = require('../../../config/dbConn');
const formatDate = require('../../../utils/formatDate');

const transactionsData = async (req, res) => {
    const userId = req.user.userId; 
    const { transactionType } = req.body;

    try {
        let query;
        let params;

        if (transactionType === 'All') {
            query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY timestamp DESC';
            params = [userId];
        } else {
            query = 'SELECT * FROM transactions WHERE user_id = ? AND kind = ? ORDER BY timestamp DESC';
            params = [userId, transactionType];
        }

        const [data] = await db.query(query, params);

        // Count query
        const countQuery = transactionType === 'All' 
            ? 'SELECT COUNT(*) AS transactionCount FROM transactions WHERE user_id = ?'
            : 'SELECT COUNT(*) AS transactionCount FROM transactions WHERE user_id = ? AND kind = ?';
        
        const [countData] = await db.query(countQuery, params);

        if (data.length > 0) {
            data.forEach(item => {
                item.timestamp = formatDate(item.timestamp);  
            });

            res.status(201).json({
                transactionCount: countData[0].transactionCount, 
                transactions: data 
            });
        } else {
            res.status(404).json({ message: 'No transactions found' });
        }

    } catch (err) {
        console.error('Database query error:', err);  
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = transactionsData;
