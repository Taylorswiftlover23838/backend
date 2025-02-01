const db = require("../../config/dbConn");
const generateClientSeed = require("../../utils/generateClientSeed");
const generateServerSeed = require("../../utils/generateServerSeed");
const getUserData = require('../../utils/getUserData')

const updateSeed = async (req, res) => {
  const userId = req.user.userId;
  const { newClientSeed } = req.body;

  try {
    const ClientSeed = newClientSeed.trim() !== "" ? newClientSeed : generateClientSeed();
    const HashedServerSeed = generateServerSeed();

    await db.query(
      "UPDATE users SET clientSeed = ?, serverSeed = ?, nonce = 0 WHERE id = ?",
      [ClientSeed, HashedServerSeed, userId]
    );

    const userData = await getUserData(userId);
    const currentTime = new Date();

    res.status(200).json({
      seed: {
        userId: userId,
        serverSeed: userData.serverSeed,
        clientSeed: userData.clientSeed,
        nonce: userData.nonce,
        timestamp: currentTime,
      },
    });
  } catch (error) {
    console.error("Error updating seed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateSeed;
