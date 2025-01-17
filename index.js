// index.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const userController = require('./controllers/userControllers');
const studentController = require('./controllers/studentController');
const loginController = require('./controllers/loginController');
const honorsRegController = require('./controllers/honorsRegController');
const cors = require('cors');
// Route to insert users from Excel file

app.use(cors());

// Middleware to handle JSON requests
app.use(express.json());
// app.use(cors());
// MySQL connection setup
const db = mysql.createConnection({
  host: 'localhost',      // Your MySQL server address (e.g., localhost)
  user: 'root',           // MySQL username
  password: 'aswanib', // MySQL password
  database: 'honors_registration' // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// A simple route
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.post('/registerHonors', honorsRegController.registerHonors);
app.post('/insertStudent', studentController.insertStudent);
app.get('/upload-users', userController.insertUsersFromExcel);
app.post('/loginStudent', loginController.loginUser);

// Example route to fetch data from MySQL
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';  // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users: ' + err.stack);
      return res.status(500).send('Error fetching users');
    }
    res.json(results);
  });
});


app.get('/users/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;
  const query = 'SELECT * FROM users WHERE username = ?'; // Check if roll_number column exists

  db.query(query, [rollNumber], (err, results) => {
    if (err) {
      console.error('Error fetching user data: ' + err.stack);
      return res.status(500).send('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    
    return res.status(200).json(results[0]); // Send the first matching user
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
