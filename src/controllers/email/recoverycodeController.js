const db = require("../../config/dbConn");
const nodemailer = require("nodemailer");
const generateRecoveryCode = require("../../utils/generateRecoveryCode");

const sendRecoveryCode = async (req, res) => {
  const { email } = req.body;

  const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (user.length === 0) {
    return res.status(401).json({ message: "Email not registered" });
  }

  const recoveryCode = generateRecoveryCode();

  await db.query(
    'UPDATE users SET recovery_Code = ?, expires_at = ? WHERE email = ?',
    [recoveryCode, new Date(Date.now() + 15 * 60 * 1000), email]
  );

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const text = `
    <h1>Password Recovery</h1>
    <p>Here is your recovery code:</p>
    <h2>${recoveryCode}</h2>
    <p>This code will expire in 15 minutes. Please use it to reset your password.</p>
    `;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Recovery Code",
    html: text,
  };

  try {
    const emailSent = await transporter.sendMail(mailOptions);
    console.log("Email sent with ID:", emailSent.messageId);
    res.status(200).json({message: "Recovery code sent"})
  } catch (err) {
    res.status(500).json({ err: "An error occurred while sending the email." });
  }
};

module.exports = sendRecoveryCode;