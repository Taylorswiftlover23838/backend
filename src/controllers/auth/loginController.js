const bcrypt = require('bcrypt');  
const db = require('../../config/dbConn');  
const jwt = require('jsonwebtoken');   

const login = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    try {
        const [user] = await db.query(
            "SELECT * FROM users WHERE email = ? OR username = ?",
            [emailOrUsername, emailOrUsername]
        );

        if (user.length === 0) {
            return res.status(401).json({ message: "Email not registered" });
        }

        const hashedPassword = user[0].password;

        const match = await bcrypt.compare(password, hashedPassword);

        if (!match) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const accessToken = jwt.sign({ userId: user[0].id, role: user[0].role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10min" });
        const refreshToken = jwt.sign({ userId: user[0].id, role: user[0].role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7days" });

        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Lax' });

        res.status(200).json({
            message: "Login success",
            accessToken: accessToken,
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "An error occurred during login" });
    }
};

module.exports = login;