const updateUserBalance = require("../../../utils/UpdateUserBalance");
const getUserData = require('../../../utils/getUserData');
const getDiceRoll = require('../../../utils/gameUtil/diceUtil');
const createBet = require('../../../utils/createBet');

const dice = async (req, res) => {
  const userId = req.user.userId;
  const { value, rollType, betAmount } = req.body;

  try {
    const userData = await getUserData(userId);

    const clientSeed = userData.clientSeed;
    const rawServerSeed = userData.rawServerSeed;
    const nonce = userData.nonce;
    const balance = Number(userData.balance);
    
    await createBet(balance, betAmount, userId);

    const roll = getDiceRoll(rawServerSeed, clientSeed, nonce);

    let winChance = rollType === "over" ? 100 - value : value;
    
    const multiplier = (100 / winChance).toFixed(2);

    const won = (rollType === "over" && roll > value) || (rollType === "under" && roll < value);

    if (won && betAmount) {
      await updateUserBalance(userId, betAmount * multiplier, "Dice", "Won Round", "increase");
    }

    res.status(200).json({ roll: roll, won: won });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
};

module.exports = dice;
