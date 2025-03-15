require('dotenv').config();
const mysql = require('mysql2');

// Configure MySQL connection
const db = require('../db');

// Controller to insert drop request data
exports.dropRequest = async (req, res) => {
  const { rollNumber, drop_year, drop_semester } = req.body;

  console.log("Year and details for drop:", rollNumber, drop_year, drop_semester);

  // Validate input fields
  if (!rollNumber || !drop_year || !drop_semester) {
    return res.status(400).json({ message: 'All fields are required to drop' });
  }

  // Fetch student details from students table
  const getStudentQuery = `SELECT name, department FROM students WHERE rollNo = ?`;

  db.query(getStudentQuery, [rollNumber], (err, studentResults) => {
    if (err) {
      console.error('Error fetching student details:', err);
      return res.status(500).json({ message: 'Error fetching student details' });
    }

    if (studentResults.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { name, department } = studentResults[0];

    // Fetch passout_year from registrations table
    const getPassoutYearQuery = `
      SELECT passout_year FROM registrations 
      WHERE student_id = ? AND year = ? AND sem = ?
    `;

    db.query(getPassoutYearQuery, [rollNumber, drop_year, drop_semester], (err, regResults) => {
      if (err) {
        console.error('Error fetching passout year:', err);
        return res.status(500).json({ message: 'Error fetching passout year' });
      }

      if (regResults.length === 0) {
        return res.status(404).json({ message: 'No registration record found for the given details' });
      }

      const { passout_year } = regResults[0];

      // Insert drop request with passout_year
      const insertDropRequestQuery = `
        INSERT INTO droprequests (rollNo, year, sem, current_year, department, name) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(insertDropRequestQuery, [rollNumber, drop_year, drop_semester, passout_year, department, name], (err, result) => {
        if (err) {
          console.error('Error inserting drop request:', err);
          return res.status(500).json({ message: 'Error inserting drop request' });
        }

        return res.status(200).json({ message: 'Drop request submitted successfully' });
      });
    });
  });
};
