const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});

// Controller to insert course data into the courses table
exports.insertTrackCourse = async (req, res) => {
  const { trackCourseName, course_name, course_id, department, year, sem } = req.body;
  // console.log("details " + course_name, course_id, department)
  if (!trackCourseName || !course_name || !course_id || !department || !year || !sem) {
    // console.log(course_name, course_id, department)
    return res.status(400).json({ message: 'All fields are required' });
  }
  const courseQuery = 'INSERT INTO TrackCourses (department, year, sem, trackCourseName, course_name, course_id) VALUES (?, ?, ?, ?, ?, ?)';
  // console.log(year, sem)
  db.query(courseQuery, [department, year, sem, trackCourseName, course_name, course_id], (err, results) => {
    if (err) {
      console.error('Error inserting course:', err);
      return res.status(500).json({ message: 'Error inserting course data' });
    }

    return res.status(200).json({ message: 'Course added successfully' });
  });
};
