const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to fetch registered courses
exports.getYearSemController = async (req, res) => {
    const { rollNumber } = req.params; // Access query parameter for rollNumber

  if (!rollNumber) {
    return res.status(400).send('Missing required query parameter: rollNumber');
  }

  // Query to fetch registered courses based on rollNumber
  
  const query = `SELECT year, sem FROM registrations 
  WHERE student_id = ? 
  ORDER BY year DESC, sem DESC 
  LIMIT 1`;

    db.query(query,[rollNumber], (err, results) => {
        if (err) {
            console.error('Error fetching registered courses:', err);
            return res.status(500).json({ message: 'Failed to retrieve registered courses' });
        }
        console.log('Fetched Year and Sem:', results);
        // Send the results back to the frontend
        res.status(200).json(results);
    });
};
