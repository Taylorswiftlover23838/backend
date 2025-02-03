const db = require('../../../config/dbConn');
const formatDate = require('../../../utils/formatDate')
const getUserData = require('../../../utils/getUserData')

const userData = async (req, res) => {
    const userId = req.user.userId; 

    try {
        const userData = await getUserData(userId)
        const date = formatDate(userData.created_at)
        
        res.status(200).json({ 
            userData: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                balance: userData.balance,
                role: userData.role,
                createdAt: date,
                avator: {
                    profile_image: userData.profile_image,
                },
                stats: {
                    totalWagered: userData.totalWagered,
                    totalBets: userData.totalBets,
                },

            }
        }); 

        
    } catch (err) {
        console.error('Database query error:', err);  
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = userData;