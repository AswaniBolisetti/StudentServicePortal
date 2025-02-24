const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to fetch registered courses
exports.viewDroppedStudentsDetails = async (req, res) => {
    const { department, year, sem, dropped_year} = req.body; // Access query parameter for rollNumber
    console.log("details of dept : " + department, year, sem, dropped_year)
  // Query to fetch registered courses based on rollNumber
  
  const query = `
       SELECT rollNo, Name from 
       droprequests where year = ? and sem = ? 
       and department = ? and status = 1 and
        current_year = ?
    `;

    db.query(query,[year, sem, department, dropped_year], (err, results) => {
        if (err) {
            console.error('Error fetching registered courses:', err);
            return res.status(500).json({ message: 'Failed to retrieve registered courses' });
        }

        // Send the results back to the frontend
        res.status(200).json(results);
    });
};

// Export the controller
// module.exports = exports.registeredCoursesController;
