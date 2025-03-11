const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});

exports.deleteStudentData = async (req, res) => {
  const { passout_year, department } = req.body;
  console.log("Deletion data: ", passout_year, department);

  if (!passout_year || !department) {
    return res.status(400).json({ message: 'Passout year and department are required' });
  }

  // Step 1: Fetch student IDs from registrations
  const fetchStudentIdsQuery = 'SELECT student_id FROM registrations WHERE passout_year = ? AND department = ?';

  db.query(fetchStudentIdsQuery, [passout_year, department], (err, results) => {
    if (err) {
      console.error('Error fetching student IDs:', err);
      return res.status(500).json({ message: 'Error fetching student IDs' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    const studentIds = results.map(row => row.student_id);
    
    if (studentIds.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    // Step 2: Delete from related tables
    const deleteCgpaQuery = 'DELETE FROM cgpa WHERE username IN (?)';
    const deleteUsersQuery = 'DELETE FROM users WHERE username IN (?)';
    const deleteStudentsQuery = 'DELETE FROM students WHERE rollNo IN (?)';
    const deleteRegistrationsQuery = 'DELETE FROM registrations WHERE student_id IN (?)';
    const deleteDropRequestsQuery = 'DELETE FROM droprequests WHERE rollNo IN (?)';

    db.query(deleteCgpaQuery, [studentIds], (err) => {
      if (err) console.error('Error deleting from cgpa_details:', err);
    });

    db.query(deleteUsersQuery, [studentIds], (err) => {
      if (err) console.error('Error deleting from users:', err);
    });

    db.query(deleteStudentsQuery, [studentIds], (err) => {
      if (err) console.error('Error deleting from students:', err);
    });

  db.query(deleteDropRequestsQuery, [studentIds], (err) => {
      if (err) console.error('Error deleting from droprequests:', err);
    });
    
    db.query(deleteRegistrationsQuery, [studentIds], (err) => {
      if (err) {
        console.error('Error deleting from registrations:', err);
        return res.status(500).json({ message: 'Error deleting from registrations' });
      }

      return res.status(200).json({ message: 'Student data deleted successfully' });
    });
  });
};
