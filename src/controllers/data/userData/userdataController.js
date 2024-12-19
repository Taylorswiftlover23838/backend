const db = require('../../../config/dbConn');
const formatDate = require('../../../utils/formatDate')
const userData = async (req, res) => {
    const userId = req.user.userId; 

    try {
        const [results] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const userData = results[0];
        const date = formatDate(userData.created_at)
        
        res.status(200).json({ 
            userData: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                balance: userData.balance,
                role: userData.role,
                createdAt: date,
                profile_image: userData.profile_image
            }
        }); 

        
    } catch (err) {
        console.error('Database query error:', err);  
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = userData;