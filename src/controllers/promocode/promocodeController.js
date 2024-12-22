const db = require("../../config/dbConn");
const updateUserBalance = require('../../utils/UpdateUserBalance')

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

    updateUserBalance(userId, codeData.token_amount, "Promotion", "Use Code");


    res.status(200).json({
      message: "Promo code redeemed successfully",
    });
  } catch (err) {
    console.error('Database query error:', err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = promoCode;