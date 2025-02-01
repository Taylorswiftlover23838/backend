const db = require('../../../config/dbConn');

const transactionsData = async (req, res) => {
    const userId = req.user.userId;
    const { transactionType = 'All', page = 1 } = req.body; 

    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        const isAllTransactions = transactionType === 'All';
        const baseQuery = `
            SELECT * FROM transactions 
            WHERE user_id = ? 
            ${isAllTransactions ? '' : 'AND kind = ?'} 
            ORDER BY timestamp DESC 
            LIMIT ? OFFSET ?`;
        
        const baseParams = isAllTransactions 
            ? [userId, limit, offset] 
            : [userId, transactionType, limit, offset];

        const [transactions] = await db.query(baseQuery, baseParams);

        const countQuery = `
            SELECT COUNT(*) AS transactionCount 
            FROM transactions 
            WHERE user_id = ? 
            ${isAllTransactions ? '' : 'AND kind = ?'}`;
        
        const countParams = isAllTransactions 
            ? [userId] 
            : [userId, transactionType];

        const [countResult] = await db.query(countQuery, countParams);
        const transactionCount = countResult[0].transactionCount;

        const response = transactions.length > 0
            ? { transactionCount, transactions }
            : { transactionCount: 0, transactions: [], message: 'No transactions found' };

        res.status(200).json(response);

    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = transactionsData;