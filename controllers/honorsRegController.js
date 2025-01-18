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

    // Verify the ID token and get the payload
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Ensure this matches your client ID
    });

    // Extract the payload from the token
    const payload = ticket.getPayload();

    // Get the email from the payload
    const emailFromToken = payload.email;
    console.log("token from mail"+emailFromToken)
    console.log("emailFromRequest"+emailFromRequest)

    // Check if the email from the token matches the email from the request
    if (emailFromToken !== emailFromRequest) {
      return { error: 'Email mismatch' }; // Return an error object instead of throwing
    }

    // Return the payload (you can also return other data if needed)
    return payload;

  } catch (error) {
    console.error('Error verifying Google token:', error);
    return { error: 'Invalid Google token or email mismatch' }; // Return an error object instead of throwing
  }
};

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib',    // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

function verifyToken(req, res) {
    const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header
  
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
  
    try {
      // Verify and decode the token
      const { rollNumber} = req.body;
      const secretKey = rollNumber; // Same password used during token generation
      console.log("token is "+token);

      const decoded = jwt.verify(token, secretKey);
  
      // Cross-check the username
      const usernameFromToken = decoded.username;
      console.log("token usernameFromToken "+usernameFromToken);
      console.log("token rollNumber "+rollNumber);
        
    } catch (error) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
}
  
// Controller to insert honors registration data
// Controller to insert honors registration data
exports.registerHonors = async (req, res) => {
  const { rollNumber, year, sem, avgscore, course } = req.body;
  // console.log(rollNumber, year, sem, avgscore);

  // Check if all required fields are present
  if (!rollNumber || !year || !sem || !avgscore) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Eligibility check: average score must be greater than 70
  if (avgscore <= 70) {
    return res.status(400).json({ message: 'Not eligible for honors registration. Average score must be greater than 70.' });
  }

  const defaultCourse = ['21CS01'];
  const courseToInsert = (course && Array.isArray(course)) ? course : defaultCourse;

  const tokenVerificationResult = verifyToken(req, res);
  if (tokenVerificationResult) {
    return tokenVerificationResult;
  }

  // Check if the student already has a registration
  const checkExistingStudentQuery = 'SELECT * FROM registrations WHERE student_id = ?';
  db.query(checkExistingStudentQuery, [rollNumber], (err, results) => {
    if (err) {
      console.error('Error checking existing registration:', err);
      return res.status(500).json({ message: 'Error checking existing registration' });
    }

    if (results.length > 0) {
      // Student exists
      console.log("Already registeredd")
      return res.status(404).json({ message: 'Already registered' });
      let existingCourses;
      try {
        existingCourses = JSON.parse(results[0].course_id); // Attempt to parse as JSON
        if (!Array.isArray(existingCourses)) {
          throw new Error('Course data is not an array');
        }
      } catch (parseError) {
        // Handle non-JSON or invalid JSON by treating it as a plain string
        existingCourses = [results[0].course_id];
      }

      const updatedCourses = [...new Set([...existingCourses, ...courseToInsert])]; // Remove duplicates

      // Update the course_id field
      const updateCoursesQuery = 'UPDATE registrations SET course_id = ? WHERE student_id = ?';
      db.query(updateCoursesQuery, [JSON.stringify(updatedCourses), rollNumber], (err, updateResults) => {
        if (err) {
          console.error('Error updating courses:', err);
          return res.status(500).json({ message: 'Error updating courses' });
        }

        return res.status(200).json({ message: 'Course registration updated successfully' });
      });
    } else {
      // Student doesn't exist
      
     // First, fetch the department using the rollNumber
const getDepartmentQuery = 'SELECT department FROM students WHERE rollNo = ?';

db.query(getDepartmentQuery, [rollNumber], (err, results) => {
  if (err) {
    console.error('Error fetching department:', err);
    return res.status(500).json({ message: 'Error fetching department' });
  }

  if (results.length === 0) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const department = results[0].department; // Get the department from the query result

  // Now, proceed with the INSERT INTO query
  const insertHonorsQuery = 'INSERT INTO registrations (student_id, year, sem, avg_score, course_id, department) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(insertHonorsQuery, [rollNumber, year, sem, avgscore, JSON.stringify(courseToInsert), department], (err, insertResults) => {
    if (err) {
      console.error('Error inserting honors registration data:', err);
      return res.status(500).json({ message: 'Error inserting honors registration data' });
    }

    return res.status(200).json({ message: 'Honors registration successful' });
  });
});

    }
  });
};


