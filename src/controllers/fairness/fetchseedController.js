const getFairnessdata = require('../../utils/getFairnessData')

const fetchSeed = async (req, res) => {
  const userId = req.user.userId; 

  try {
    const fairnessData = await getFairnessdata(userId)
        
    res.status(200).json({ 
        seed: {
            userId: userId,
            serverSeed: fairnessData.serverSeed,
            clientSeed: fairnessData.clientSeed,
            nonce: fairnessData.nonce,
            timestamp: fairnessData.timestamp,
        }
    }); 

  } catch (error) {}
};

module.exports = fetchSeed;
