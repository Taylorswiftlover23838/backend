const db = require('../../config/dbConn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');   
const generateClientSeed = require('../../utils/generateClientSeed')
const generateServerSeed = require('../../utils/generateServerSeed')

 const register = async (req, res) => {
    const { email, username, password } = req.body;
  
    try {
      const [user] = await db.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [email, username]
      );
  
      if (user.length > 0) {
        return res.status(401).json({ message: "Email or username already exists" });
      }

      const clientSeed = generateClientSeed();
      const { rawServerSeed, hashedServerSeed} = generateServerSeed();
  
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query("INSERT INTO users (email, username, password, clientSeed, serverSeed, rawServerSeed) VALUES (?, ?, ?, ?, ?, ?)", [email, username, hashedPassword, clientSeed, hashedServerSeed, rawServerSeed]);
      
      const [registeredUser] = await db.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [email, username]
      );

      const accessToken = jwt.sign({ userId: registeredUser[0].id, role: registeredUser[0].role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10mins" });
      const refreshToken = jwt.sign({ userId: registeredUser[0].id, role: registeredUser[0].role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7days" });
      
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, sameSite: 'Lax' });

      res.status(200).json({ message: "User registered successfully", accessToken: accessToken});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "An error occurred during registration" });
    }
}

module.exports = register