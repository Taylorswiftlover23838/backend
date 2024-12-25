const db = require('../../config/dbConn');  

const sendMessage = (req, res) => {
    const {messageInput, username, profile_image} = req.body;
 
    try {
        
        db.query('INSERT INTO messages (username, message, profile_image) VALUES (?, ?, ?)', [username, messageInput, profile_image], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Message sent' });
        });
    } catch(err) {

    }

}

module.exports = sendMessage;