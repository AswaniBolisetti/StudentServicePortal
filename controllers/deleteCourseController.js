const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});

// Controller to delete a course from the courses table

exports.deleteCourse = async (req, res) => {
  const { courseId } = req.params; // Correctly accessing courseId from URL params
  console.log("parameters: ", req.params);
  console.log("id is " + courseId); // Log the courseId
  
  if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
  }

  const deleteQuery = 'DELETE FROM courses WHERE course_id = ?';

  db.query(deleteQuery, [courseId], (err, results) => {
      if (err) {
          console.error('Error deleting course:', err);
          return res.status(500).json({ message: 'Error deleting course' });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Course not found' });
      }

      return res.status(200).json({ message: 'Course deleted successfully' });
  });
};
