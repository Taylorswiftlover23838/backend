const db = require("../../config/dbConn");
const generateTransactionId = require('../../utils/generateTransactionId');
const { emitToUser } = require('../../socket');

const promoCode = async (req, res) => {
  const userId = req.user.userId;
  const { promoCode } = req.body;

  try {
    const [code] = await db.query("SELECT * FROM promocodes WHERE code = ?", [
      promoCode,
    ]);

    if (code.length === 0) {
      return res.status(401).json({ message: "Invalid promo code" });
    }

    const codeData = code[0];

    const currentTime = new Date();
    const expiryTime = new Date(codeData.expiration_date);

    if (currentTime > expiryTime) {
      return res.status(401).json({ message: "Code has expired" });
    }

     const [existingRedemption] = await db.query(
      `SELECT * FROM promo_redeems WHERE user_id = ? AND promocode = ?`,
      [userId, promoCode]
    );

    if (existingRedemption.length > 0) {
      return res
        .status(401)
        .json({ message: "You have already redeemed this promo code" });
    }


    await db.query(
      `
        UPDATE users SET balance = balance + ? WHERE id = ?
    `,
      [codeData.token_amount, userId]
    );

    // Get the updated balance
    const [updatedUser] = await db.query(
      "SELECT balance FROM users WHERE id = ?",
      [userId]
    );

    // Emit to the specific user who redeemed the code
    emitToUser(userId, "userDataUpdate", updatedUser[0].balance);

    await db.query(
      `
        UPDATE promocodes SET used_count = used_count + 1 WHERE code = ?
    `,
      [promoCode]
    );

    await db.query(
      `
        INSERT INTO promo_redeems (user_id, promocode) 
        VALUES (?, ?)
    `,
      [userId, promoCode]
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
        "Promotion",
        codeData.token_amount,
        updatedUser[0].balance,
        "Use Code"
      ]
    );

    res.status(200).json({
      message: "Promo code redeemed successfully",
    });
  } catch (err) {
    console.error('Database query error:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = promoCode;