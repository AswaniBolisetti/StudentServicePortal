const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to fetch registered courses
exports.viewRegStudentsDetails = async (req, res) => {
    const { department, year, sem, registered_year, track_name_formatted} = req.body; // Access query parameter for rollNumber
    console.log("details of dept : " + department, year, sem, registered_year, track_name_formatted)
  // Query to fetch registered courses based on rollNumber
    if(track_name_formatted){
        const query = `
        SELECT r.student_id, s.name, r.year, r.sem, r.department
        FROM registrations r
        JOIN students s ON r.student_id = s.rollNo
        WHERE r.department = ? AND r.year = ? AND r.sem = ? AND r.passout_year = ? AND trackcourse = ? AND dropped_status = 0 
    `;
    db.query(query,[department, year, sem, registered_year, track_name_formatted], (err, results) => {
        if (err) {
            console.error('Error fetching registered courses:', err);
            return res.status(500).json({ message: 'Failed to retrieve registered courses' });
        }

        // Send the results back to the frontend
        res.status(200).json(results);
    });
    }
    else{
  const query = `
        SELECT r.student_id, s.name, r.year, r.sem, r.department
        FROM registrations r
        JOIN students s ON r.student_id = s.rollNo
        WHERE r.department = ? AND r.year = ? AND r.sem = ? AND r.passout_year = ? AND dropped_status = 0 
    `;
    db.query(query,[department, year, sem, registered_year], (err, results) => {
        if (err) {
            console.error('Error fetching registered courses:', err);
            return res.status(500).json({ message: 'Failed to retrieve registered courses' });
        }

        // Send the results back to the frontend
        res.status(200).json(results);
    });
}
   
};

// Export the controller
// module.exports = exports.registeredCoursesController;
