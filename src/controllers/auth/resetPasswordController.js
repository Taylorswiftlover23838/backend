const db = require("../../config/dbConn");
const bcrypt = require('bcrypt');

const resetPassword = async (req, res) => {
    const { recoveryCode, newPassword } = req.body;
    console.log(recoveryCode)

    try {
        const [user] = await db.query("SELECT * FROM users WHERE recovery_Code = ?", [recoveryCode]);

        if (user.length === 0) {
            console.log(user)
            return res.status(400).json({ message: "Invalid recovery code" });
        }

        const userData = user[0];

        const currentTime = new Date();
        const expiryTime = new Date(userData.expires_at);

        if (currentTime > expiryTime) {
            return res.status(400).json({ message: "Recovery code has expired" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.query("UPDATE users SET password = ?, recovery_Code = NULL, expires_at = NULL WHERE email = ?", [hashedPassword, userData.email]);

        res.status(200).json({ message: "Password successfully reset" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred while resetting the password" });
    }
};

module.exports = resetPassword;