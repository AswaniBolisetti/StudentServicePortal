require('dotenv').config();
const mysql = require('mysql2');

// Configure MySQL connection
const db = require('../db'); 
// Controller to delete a course from the courses table

exports.deleteUser = async (req, res) => {
  const { student_id } = req.params; // Correctly accessing courseId from URL params
  console.log("parameters: ", req.params);
  console.log("id is " + student_id); // Log the courseId
  
  if (!student_id) {
      return res.status(400).json({ message: 'Student id is required' });
  }

  const deleteQuery = 'DELETE FROM cgpa WHERE username = ?';

  db.query(deleteQuery, [student_id], (err, results) => {
      if (err) {
          console.error('Error deleting course:', err);
          return res.status(500).json({ message: 'Error deleting course' });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Student not found' });
      }

      return res.status(200).json({ message: 'Student deleted successfully' });
  });
};
