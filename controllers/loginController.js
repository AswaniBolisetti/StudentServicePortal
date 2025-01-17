const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const { user } = require('pg/lib/defaults');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to handle user login
exports.loginUser = (req, res) => {
  const { username, password } = req.body;
//   console.log(username, password);
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Query to check if the username and password match any record in the users table
  const loginQuery = 'SELECT * FROM users WHERE username = ? AND password = ?';

  // Execute the query
  db.query(loginQuery, [username, password], (err, results) => {
    if (err) {
      console.error('Error during login:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      const token = jwt.sign({ username: username }, username);
      // User found, login successful
      return res.status(200).json({
        message: 'Login successful',
        user: results[0], // Return user details
        token: token       // Send the token to the client
      });
     

    } else {
      // Invalid credentials
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  });
};
