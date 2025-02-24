const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});
exports.approveRequest = async (req, res) => {
    const { droprollno } = req.params;
    const { year, sem } = req.body;
  
    if (!droprollno || !year || !sem) {
        return res.status(400).json({ message: 'Roll Number, Year, and Semester are required' });
    }
  
    const updateDropQuery = 'UPDATE droprequests SET status = TRUE WHERE rollNo = ? AND year = ? AND sem = ?';
  
    db.query(updateDropQuery, [droprollno, year, sem], (err, dropResults) => {
        if (err) {
            console.error('Error updating droprequests:', err);
            return res.status(500).json({ message: 'Error updating droprequests' });
        }
  
        if (dropResults.affectedRows === 0) {
            return res.status(404).json({ message: 'Drop request not found' });
        }
  
        const updateRegQuery = 'UPDATE registrations SET dropped_status = 1 WHERE student_id = ? AND year = ? AND sem = ?';
  
        db.query(updateRegQuery, [droprollno, year, sem], (err, regResults) => {
            if (err) {
                console.error('Error updating registrations:', err);
                return res.status(500).json({ message: 'Error updating registrations' });
            }
  
            if (regResults.affectedRows === 0) {
                return res.status(404).json({ message: 'Registration not found for update' });
            }
  
            // ✅ Only one final response sent here
            return res.status(200).json({ message: 'Drop request and registration updated successfully' });
        });
    });
  };
  