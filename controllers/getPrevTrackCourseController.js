const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to fetch registered courses
exports.getPrevTrackCourse = async (req, res) => {
    const { year, sem, rollNumber } = req.params; // Access query parameter for rollNumber
    console.log("PREV TRACK : " + year, sem, rollNumber)
  if (!rollNumber) {
    return res.status(400).send('Missing required query parameters');
  }

  // Query to fetch registered courses based on rollNumber
  
  const query = `SELECT trackcourse FROM registrations 
  WHERE year = ? and sem = ? and student_id = ?
 `;
//  ORDER BY year DESC, sem DESC 
//  LIMIT 1

    db.query(query,[year, sem, rollNumber], (err, results) => {
        if (err) {
            console.error('Error fetching registered courses:', err);
            return res.status(500).json({ message: 'Failed to retrieve registered courses' });
        }
        console.log('Fetched Prev Track:', results);
        // Send the results back to the frontend
        res.status(200).json(results);
    });
};
