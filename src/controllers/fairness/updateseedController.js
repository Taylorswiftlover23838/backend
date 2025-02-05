const generateClientSeed = require("../../utils/generateClientSeed");
const generateServerSeed = require("../../utils/generateServerSeed");
const UpdateFairness = require('../../utils/UpdateFairness')
const getFairnessData = require('../../utils/getFairnessData')

const updateSeed = async (req, res) => {
  const userId = req.user.userId;
  const { newClientSeed } = req.body;

  try {
    const clientSeed = newClientSeed.trim() !== "" ? newClientSeed : generateClientSeed();
    const { serverSeed, hashedServerSeed} = generateServerSeed();

    await UpdateFairness(userId, hashedServerSeed, clientSeed, 0, serverSeed)

    const fairnessData = await getFairnessData(userId);

    res.status(200).json({
      seed: {
        userId: userId,
        serverSeed: fairnessData.serverSeed,
        clientSeed: fairnessData.clientSeed,
        nonce: fairnessData.nonce,
        timestamp: fairnessData.timestamp,
      },
    });
  } catch (error) {
    console.error("Error updating seed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateSeed;
