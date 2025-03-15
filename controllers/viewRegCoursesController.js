require('dotenv').config();
const mysql = require('mysql2');

// Configure MySQL connection
const db = require('../db');

// Controller to fetch registered courses
exports.registeredCoursesController = async (req, res) => {
    const { rollNumber } = req.params; // Access query parameter for rollNumber

  if (!rollNumber) {
    return res.status(400).send('Missing required query parameter: rollNumber');
  }

  // Query to fetch registered courses based on rollNumber
  
  const query = 'SELECT * FROM registrations where student_id = ?';

    db.query(query,[rollNumber], (err, results) => {
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
