const mysql = require('mysql2');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '543677223710-im5qe7km6rtfp8mvk7fv48rtqv7gesgm.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration'
});

// Function to verify Google token
const verifyGoogleToken = async (token, emailFromRequest) => {
  try {
    console.log("Email from request: " + emailFromRequest);
    console.log("Token: " + token);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const emailFromToken = payload.email;
    
    console.log("Email from token: " + emailFromToken);
    console.log("Email from request: " + emailFromRequest);

    if (emailFromToken !== emailFromRequest) {
      return { error: 'Email mismatch' };
    }

    return payload;
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return { error: 'Invalid Google token or email mismatch' };
  }
};

// Update password controller
exports.updatePassword = async (req, res) => {
  const { rollNo, newPassword } = req.body;
  console.log(rollNo, newPassword)
  if (!rollNo || !newPassword) {
    return res.status(400).json({ message: 'username and password are required' });
  }

  try {
    
    const updatePasswordQuery = 'UPDATE users SET password = ? WHERE username = ?';

    db.query(updatePasswordQuery, [newPassword , rollNo], (err, results) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Error updating password' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'Password updated successfully' });
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
