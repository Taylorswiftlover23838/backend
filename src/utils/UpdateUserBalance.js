const db = require("../config/dbConn");
const { emitToUser } = require(".././socket");
const generateTransactionId = require("../utils/generateTransactionId");

const UpdateUserBalance = async (userId, amount, kind, action) => {
  await db.query(
    `
          UPDATE users SET balance = balance + ? WHERE id = ?
      `,
    [amount, userId]
  );

  const [updatedUser] = await db.query(
    "SELECT balance FROM users WHERE id = ?",
    [userId]
  );

  const transactionId = generateTransactionId();

  await db.query(
    `
              INSERT INTO transactions (transaction_id, user_id, kind, amount, balance, action) 
              VALUES (?, ?, ?, ?, ?, ?)
          `,
    [
      transactionId,
      userId,
      kind,
      amount,
      updatedUser[0].balance,
      action,
    ]
  );

  emitToUser(userId, "userDataUpdate", updatedUser[0].balance);
};

module.exports = UpdateUserBalance;
