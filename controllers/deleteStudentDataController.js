const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});


exports.deleteStudentData = async (req, res) => {
    const { passout_year, department} = req.body; 
  console.log("deletion data: ", passout_year, department);
 
  
  if (!passout_year || !department) {
      return res.status(400).json({ message: 'passout year and department is required' });
  }

  const deleteQuery = 'DELETE FROM registrations WHERE passout_year = ? AND department = ?';

  db.query(deleteQuery, [passout_year, department], (err, results) => {
      if (err) {
          console.error('Error deleting student data:', err);
          return res.status(500).json({ message: 'Error deleting student data' });
      }

      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'student data not found' });
      }

      return res.status(200).json({ message: 'Student data deleted successfully' });
  });
};
