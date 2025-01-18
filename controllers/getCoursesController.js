const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

exports.getCoursesController =(req, res) => { 
      const { year, sem, rollNumber } = req.query; // Access query parameters
  
      if (!year || !sem) {
        return res.status(400).send('Missing required query parameters: year and sem');
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
      const query = 'SELECT course_name FROM courses WHERE year = ? AND sem = ? AND department = ?';
      db.query(query, [year, sem, department], (err, results) => {
        if (err) {
          console.error('Error fetching courses:', err);
          return res.status(500).send('Internal Server Error');
        }
  
        if (results.length === 0) {
          return res.status(404).send('No courses found for the specified year and semester');
        }
  
        // Send the fetched courses as the response
        res.json(results);
      });
    });
    };
  
//   module.exports = getCoursesController;