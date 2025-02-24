const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});

// Controller to insert drop request data
exports.dropRequest = async (req, res) => {
  const { rollNumber, drop_year, drop_semester, department, name } = req.body;

  console.log("Year and details for drop:", rollNumber, drop_year, drop_semester, department);

  // Validate input fields
  if (!rollNumber || !drop_year || !drop_semester || !department || !name) {
    return res.status(400).json({ message: 'All fields are required to drop' });
  }

  const currentYear = new Date().getFullYear();

  const insertDropRequestQuery = `
    INSERT INTO droprequests (rollNo, year, sem, current_year, department, name) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(insertDropRequestQuery, [rollNumber, drop_year, drop_semester, currentYear, department, name], (err, result) => {
    if (err) {
      console.error('Error inserting drop request:', err);
      return res.status(500).json({ message: 'Error inserting drop request' });
    }

    return res.status(200).json({ message: 'Drop request submitted successfully' });
  });
};
