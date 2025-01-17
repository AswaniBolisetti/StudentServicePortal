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
exports.registerHonors = async (req, res) => {
  const { rollNumber, year, sem, avgscore } = req.body;

  // Check if all required fields are present
  if (!rollNumber || !year || !sem || !avgscore) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Eligibility check: average score must be greater than 70
  if (avgscore <= 70) {
    return res.status(400).json({ message: 'Not eligible for honors registration. Average score must be greater than 70.' });
  }

//   const { authorization } = req.headers;
//   const googleToken = authorization.split(' ')[1]; 

//   if (!googleToken) {
//     return res.status(400).json({ message: 'Token is required' });
//   }

  // Verify the Google token
//   const verifiedEmail = await verifyGoogleToken(googleToken, req.body.email);

  // If verification failed (email mismatch or invalid token)
//   if (verifiedEmail.error) {
//     return res.status(400).json({ message: verifiedEmail.error });
//   }

  // Insert the honors registration details into the database



//---------------------------------




// Middleware or API logic to verify the token and cross-check the username
 const tokenVerificationResult = verifyToken(req, res);
  if (tokenVerificationResult) {
    return tokenVerificationResult; // Exit early if token verification failed
  }

//--------------------
  const insertHonorsQuery = 'INSERT INTO registrations (student_id, year, sem, avg_score, course_id) VALUES (?, ?, ?, ?, ?)';
  db.query(insertHonorsQuery, [rollNumber, year, sem, avgscore, 2], (err, results) => {
    if (err) {
      console.error('Error inserting honors registration data:', err);
      return res.status(500).json({ message: 'Error inserting honors registration data' });
    }

    return res.status(200).json({ message: 'Honors registration successful' });
  });
};
