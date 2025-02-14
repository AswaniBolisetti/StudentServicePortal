const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '543677223710-im5qe7km6rtfp8mvk7fv48rtqv7gesgm.apps.googleusercontent.com'; // Replace with your actual Google Client ID
const client = new OAuth2Client(CLIENT_ID);

// Google token verification
const verifyGoogleToken = async (token, emailFromRequest) => {
  try {
    console.log("email from request: " + emailFromRequest);
    console.log("token: " + token);

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const emailFromToken = payload.email;
    console.log("token from mail" + emailFromToken);
    console.log("emailFromRequest" + emailFromRequest);

    if (emailFromToken !== emailFromRequest) {
      return { error: 'Email mismatch' };
    }

    return payload;

  } catch (error) {
    console.error('Error verifying Google token:', error);
    return { error: 'Invalid Google token or email mismatch' };
  }
};

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});

function verifyToken(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const { rollNumber } = req.body;
    const secretKey = rollNumber;
    console.log("token is " + token);

    const decoded = jwt.verify(token, secretKey);

    const usernameFromToken = decoded.username;
    console.log("token usernameFromToken " + usernameFromToken);
    console.log("token rollNumber " + rollNumber);

  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Controller to insert honors registration data
exports.registerHonors = async (req, res) => {
  const { rollNumber, year, sem, courses } = req.body; // Assuming 'courses' is an array of { course_id, course_name }

  if (!rollNumber || !year || !sem || !courses || courses.length === 0) {
    return res.status(400).json({ message: 'All fields are required and at least one course must be selected' });
  }

  const tokenVerificationResult = verifyToken(req, res);
  if (tokenVerificationResult) {
    return tokenVerificationResult;
  }

  // const checkExistingStudentQuery = 'SELECT * FROM registrations WHERE student_id = ?';
  // db.query(checkExistingStudentQuery, [rollNumber], (err, results) => {
  //   if (err) {
  //     console.error('Error checking existing registration:', err);
  //     return res.status(500).json({ message: 'Error checking existing registration' });
  //   }

  //   if (results.length > 0) {
  //     return res.status(404).json({ message: 'Already registered' });
  //   }
  // });

  const getDepartmentQuery = 'SELECT department FROM students WHERE rollNo = ?';
  db.query(getDepartmentQuery, [rollNumber], (err, results) => {
    if (err) {
      console.error('Error fetching department:', err);
      return res.status(500).json({ message: 'Error fetching department' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    const currentYear = new Date().getFullYear();
    const department = results[0].department;

    const insertHonorsQuery = 'INSERT INTO registrations (student_id, year, sem, course_id, course_name, department, current_year) VALUES (?, ?, ?, ?, ?, ?, ?)';
    
    // Convert the courses to JSON format
    const courseIds = JSON.stringify(courses.map(course => course.course_id));
    const courseNames = JSON.stringify(courses.map(course => course.course_name));

    db.query(insertHonorsQuery, [rollNumber, year, sem, courseIds, courseNames, department, currentYear], (err, insertResults) => {
      if (err) {
        console.error('Error inserting honors registration data:', err);
        return res.status(500).json({ message: 'Error inserting honors registration data' });
      }

      return res.status(200).json({ message: 'Honors registration successful' });
    });
  });
};

