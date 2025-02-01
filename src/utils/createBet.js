const db = require("../config/dbConn");
const updateUserBalance = require("../utils/UpdateUserBalance");
const { emitToUser } = require("../socket");
const getUserData = require("../utils/getUserData");

const createBet = async (balance, betAmount, userId) => {
  try {
    if (betAmount > balance) {
      console.log(betAmount);
      console.log(balance);
      throw new Error("Not enough money");
    }

    await updateUserBalance(userId, betAmount, "Dice", "Create Bet", "decrease");

    await db.query(
      `
      UPDATE users 
      SET nonce = nonce + 1, 
          totalBets = totalBets + 1, 
          totalWagered = totalWagered + ? 
      WHERE id = ?
      `,
      [betAmount, userId]
    );

    const userData = await getUserData(userId);

    emitToUser(userId, "userDataUpdate", {
      updatedFields: {
        stats: {
          totalWagered: userData.totalWagered,
          totalBets: userData.totalBets,
        },
      },
    });

  } catch (error) {
    console.error("Error in createBet:", error);
    throw error;
  }
};

module.exports = createBet;
