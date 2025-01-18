const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to check registration status
exports.checkRegistrationStatus = (req, res) => {
  const { rollNumber } = req.params;

  // Validate input
  if (!rollNumber) {
    return res.status(400).json({ message: 'Roll number is required' });
  }

  // Query to check if the roll number exists in the registrations table
  const query = 'SELECT * FROM registrations WHERE student_id = ?';

  // Execute the query
  db.query(query, [rollNumber], (err, results) => {
    if (err) {
      console.error('Error during registration check:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      // Registration found
      return res.status(404).json({ message: 'Already registered' });
   
    } else {
        return res.status(200).json({ message: 'you can proceed to register' });
    }
  });
};
