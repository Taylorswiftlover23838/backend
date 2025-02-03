const db = require("../config/dbConn");
const { emitToUser } = require("../socket");
const generateTransactionId = require("../utils/generateTransactionId");
const getUserData = require("../utils/getUserData");

const UpdateUserBalance = async (userId, amount, kind, action, type) => {
  try {
    const adjustedAmount = type === "decrease" ? -amount : amount;

    emitToUser(userId, "notificationUpdate", {
      notification: {
        amount: adjustedAmount,
      },
    });
    
    await db.query("UPDATE users SET balance = balance + ? WHERE id = ?", [
      adjustedAmount,
      userId,
    ]);

    const userData = await getUserData(userId);

    const transactionId = generateTransactionId();
    await db.query(
      `
        INSERT INTO transactions (transaction_id, user_id, kind, amount, balance, action) 
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [transactionId, userId, kind, adjustedAmount, userData.balance, action]
    );

    emitToUser(userId, "userDataUpdate", {
      updatedFields: {
        balance: userData.balance,
      },
    });
  } catch (error) {
    console.error("Error updating user balance:", error.message);
    throw error;
  }
};

module.exports = UpdateUserBalance;
