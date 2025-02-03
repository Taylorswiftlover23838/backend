const db = require("../../../config/dbConn");

const diceHistory = async (req, res) => {
  const userId = req.user.userId;

  const { date } = req.body;

  try {
    res.status(200).json({ 

    }); 
  } catch (error) {
    
  }
}

module.exports =  diceHistory;