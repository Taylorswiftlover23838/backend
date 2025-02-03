const getUserData = require("../../utils/getUserData")

const fetchSeed = async (req, res) => {
  const userId = req.user.userId; 

  try {
    const currentTime = new Date();
    const userData = await getUserData(userId)
        
    res.status(200).json({ 
        seed: {
            userId: userId,
            serverSeed: userData.serverSeed,
            clientSeed: userData.clientSeed,
            nonce: userData.nonce,
            timestamp: currentTime,
        }
    }); 

  } catch (error) {}
};

module.exports = fetchSeed;
