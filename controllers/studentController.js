const mysql = require('mysql2');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '543677223710-im5qe7km6rtfp8mvk7fv48rtqv7gesgm.apps.googleusercontent.com'; // Replace with your actual Google Client ID
const client = new OAuth2Client(CLIENT_ID);



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

const updatePassword = (email, password, callback) => {
  const updatePasswordQuery = 'UPDATE users SET password = ? WHERE email = ?';

  // Execute the query
  db.query(updatePasswordQuery, [password, email], (err, results) => {
    if (err) {
      console.error('Error updating password:', err);
      return callback(err); // Return the error
    }

    callback(null, results); // Return success
  });
};


// Controller to insert student data into the students table
exports.insertStudent =async  (req, res) => {
  const { name, rollNo, email, mobileNumber, department, password } = req.body;

  // Check if all required fields are present
  if (!name || !rollNo || !email || !mobileNumber || !department || !password) {
    console.log(name, rollNo, email, mobileNumber, department, password);
    return res.status(400).json({ message: 'All fields are required' });
  }

  const { authorization } = req.headers;

  const googleToken = authorization.split(' ')[1]; // Extract the token

  if (!googleToken) {
    return res.status(400).json({ message: 'Token is required' });
  }



  const verifiedEmail = await verifyGoogleToken(googleToken, email);

  // If verification failed (email mismatch or invalid token)
  if (verifiedEmail.error) {
    return res.status(400).json({ message: verifiedEmail.error });
  }

    
  const studentQuery = 'INSERT INTO students (name, rollNo, email, mobile_no, department) VALUES (?, ?, ?, ?, ?)';

  // Insert into the students table
  db.query(studentQuery, [name, rollNo, email, mobileNumber, department], (err, studentResults) => {
    if (err) {
      console.error('Error inserting student:', err);
      return res.status(500).json({ message: 'Error inserting student data' });
    }

    // Call the updatePassword function to update the password
    updatePassword(email, password, (err, updateResults) => {
      if (err) {
        console.error('Error updating password:', err);
        return res.status(500).json({ message: 'Error updating user password' });
      }

      return res.status(200).json({
        message: 'profile created successfully',
      });
    });
  });
};

