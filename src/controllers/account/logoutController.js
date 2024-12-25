const jwt = require('jsonwebtoken');

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            res.clearCookie('refreshToken', { httpOnly: true, secure: false, sameSite: 'Lax' });

            return res.status(200).json({ message: "Successfully logged out" });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = logout;