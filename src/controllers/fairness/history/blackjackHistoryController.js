const db = require("../../../config/dbConn");

const blackjackHistory = async (req, res) => {
  const userId = req.user.userId;

  const { date, page} = req.body;

  try {
    res.status(200).json({ 
        rolls: [],
    }); 
  } catch (error) {
    
  }
};

module.exports = blackjackHistory;
