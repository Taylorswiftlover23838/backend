const jwt = require('jsonwebtoken');

const refresh = async (req, res) => {
    const refreshToken = req.cookies.refreshToken; 

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token" });
            }

            const userId = decoded.userId;
            const role = decoded.role;

            const newAccessToken = jwt.sign(
                { userId: userId, role: role },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "10min" }
            );

            res.status(200).json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error('Error during token refresh:', error);
        res.status(500).json({ message: "An error occurred during token refresh" });
    }
};

module.exports = refresh;