const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration'
});

// Controller to handle user login
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // First, check if the user has an approved drop request
  const dropCheckQuery = 'SELECT status FROM droprequests WHERE rollNo = ?';

  db.query(dropCheckQuery, [username], (dropErr, dropResults) => {
    if (dropErr) {
      console.error('Error checking drop requests:', dropErr);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // If drop request exists and status is 1 (approved)
    if (dropResults.length > 0 && dropResults[0].status === 1) {
      return res.status(403).json({ message: 'Your drop request has been approved. Login not allowed.' });
    }

    // Proceed to normal login if no approved drop request
    const loginQuery = 'SELECT * FROM users WHERE username = ? AND password = ? AND role_id = ?';

    db.query(loginQuery, [username, password, 1], (loginErr, loginResults) => {
      if (loginErr) {
        console.error('Error during login:', loginErr);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (loginResults.length > 0) {
        const token = jwt.sign({ username: username }, username);
        return res.status(200).json({
          message: 'Login successful',
          user: loginResults[0],
          token: token
        });
      } else {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    });
  });
};
