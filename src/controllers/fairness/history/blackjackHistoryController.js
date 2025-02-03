const db = require("../../../config/dbConn");

const blackjackHistory = async (req, res) => {
  const userId = req.user.userId;

  const { date } = req.body;

  try {
    res.status(200).json({ 
 
    }); 
  } catch (error) {
    
  }
};

module.exports = blackjackHistory;
