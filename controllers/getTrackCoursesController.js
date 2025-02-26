const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Controller to fetch registered courses
exports.getTrackCourseController = async (req, res) => {
    const { year, sem, rollNumber } = req.params; // Access query parameter for rollNumber

  if (!year || !sem || !rollNumber) {
    return res.status(400).send('Missing required query parameters');
  }
  const getDepartmentQuery = 'SELECT department FROM students WHERE rollNo = ?';

  db.query(getDepartmentQuery, [rollNumber], (err, results) => {
    if (err) {
      console.error('Error fetching department:', err);
      return res.status(500).json({ message: 'Error fetching department' });
    }
  
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
  
    const department = results[0].department;
  // Query to fetch registered courses based on rollNumber
  
  const query = `SELECT trackCourseName FROM TrackCourses 
  WHERE year = ? and sem = ? and department = ?`;

    db.query(query,[year, sem, department], (err, results) => {
        if (err) {
            console.error('Error fetching registered courses:', err);
            return res.status(500).json({ message: 'Failed to retrieve registered courses' });
        }
        console.log('Fetched track course name:', results);
        // Send the results back to the frontend
        res.status(200).json(results);
    });
  })
};
