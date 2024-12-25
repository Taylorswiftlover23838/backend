
const protectedRoute = async (req, res) => {
    const userId = req.user.userId; 

    try {
        res.status(200).json({ message: "You have access!", userId });

    } catch (error) {
        console.error('Error while calling protected Route:', error);
        res.status(500).json({ message: "An Error while calling protected Route" });
    }
};

module.exports = protectedRoute;