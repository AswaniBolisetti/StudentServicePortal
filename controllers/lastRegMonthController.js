const mysql = require("mysql2");
const jwt = require("jsonwebtoken");

// Configure MySQL connection
const db = mysql.createConnection({
  host: "localhost",      
  user: "root",           
  password: "aswanib",    
  database: "honors_registration"
});

// Controller to get the last registered month
exports.lastRegMonth = (req, res) => {
    const rollNumber = req.params.rollNumber; // Extract roll number from request

    const query = `
        SELECT insert_ts 
        FROM registrations 
        WHERE student_id = ? 
        ORDER BY insert_ts DESC 
        LIMIT 1
    `;

    db.query(query, [rollNumber], (err, results) => {
        if (err) {
            console.error("Error fetching last registered date:", err);
            return res.status(500).json({ message: "Failed to retrieve data" });
        }

        if (results.length === 0) {
            return res.status(200).json({ lastRegisteredDate: null }); // No prior registration
        }

        res.status(200).json({ lastRegisteredDate: results[0].insert_ts });
    });
};
