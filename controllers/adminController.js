const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to handle admin login
exports.adminLogin = (req, res) => {
  const { username, password } = req.body;

  // Check if adminUsername and adminPassword are provided
  if (!username || !password) {
    return res.status(400).json({ message: 'Admin username and password are required' });
  }

  // Query to check if the adminUsername and adminPassword match any record in the admins table
  const loginQuery = 'SELECT * FROM users WHERE username = ? AND password = ? AND role_id = ?';

  // Execute the query
  db.query(loginQuery, [username, password, 2], (err, results) => {
    if (err) {
      console.error('Error during admin login:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      // Admin found, generate a JWT token
      const token = jwt.sign({ username: username }, 'your_secret_key', { expiresIn: '1h' });

      return res.status(200).json({
        message: 'Admin login successful',
        admin: results[0], // Return admin details
        token: token       // Send the token to the client
      });
    } else {
      // Invalid credentials
      return res.status(401).json({ message: 'Invalid admin username or password' });
    }
  });
};
