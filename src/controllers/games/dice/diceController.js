const updateUserBalance = require("../../../utils/UpdateUserBalance");
const getFairnessData = require('../../../utils/getFairnessData')
const getDiceRoll = require('../../../utils/gameUtil/Dice/getDiceRoll');
const createBet = require('../../../utils/createBet');
const getUserData = require('../../../utils/getUserData')
const getRawServerSeed = require('../../../utils/getRawServerSeed')
const UpdateDiceHistory = require('../../../utils/gameUtil/Dice/UpdateDiceHistory')

const dice = async (req, res) => {
  const userId = req.user.userId;
  const { value, rollType, betAmount } = req.body;

  try {
    if (!betAmount || isNaN(betAmount) || betAmount <= 0) return res.status(400).json({message: "Enter a valid betamount"});

    const fairnessData = await getFairnessData(userId);
    const userData = await getUserData(userId)

    const clientSeed = fairnessData.clientSeed;
    const serverSeed = await getRawServerSeed(userId);
    const nonce = fairnessData.nonce;
    const fairnessId = fairnessData.id

    const balance = Number(userData.balance);
    
    await createBet(balance, betAmount, userId);

    const roll = getDiceRoll(serverSeed, clientSeed, nonce);

    let winChance = rollType === "over" ? 100 - value : value;
    
    const multiplier = (100 / winChance).toFixed(2);

    const won = (rollType === "over" && roll > value) || (rollType === "under" && roll < value);

    if (won) {
      await updateUserBalance(userId, betAmount * multiplier, "Dice", "Won Round", "increase");
    }

    await UpdateDiceHistory(betAmount, fairnessId, value, rollType, roll, nonce, won, userId);

    res.status(200).json({ roll: roll, won: won });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports = dice;
