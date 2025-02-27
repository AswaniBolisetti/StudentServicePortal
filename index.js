// index.js
const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const userController = require('./controllers/userControllers');
const cgpaController = require('./controllers/cgpaController');
const studentController = require('./controllers/studentController');
const updatePasswordController = require('./controllers/updatePasswordController');
const loginController = require('./controllers/loginController');
const honorsRegController = require('./controllers/honorsRegController');
const adminController = require('./controllers/adminController');
const registrationController = require('./controllers/checkRegController');
const courseController = require('./controllers/courseController');
const trackCourseController = require('./controllers/trackCourseController');

const viewCoursesController = require('./controllers/viewCoursesController');
const viewTrackCoursesController = require('./controllers/viewTrackCoursesController');

const deleteCourseController = require('./controllers/deleteCourseController');
const deleteTrackCourseController = require('./controllers/deleteTrackCourseController');

const approveDropReqController = require('./controllers/approveDropReqController');

const getCourseController = require('./controllers/getCoursesController');
const viewRegCoursesController = require('./controllers/viewRegCoursesController');
const viewRegStudentsDetails = require('./controllers/viewRegStudentsDetails');
const viewDroppedStudentsDetails = require('./controllers/viewDroppedStudentsController');

const dropRequestController = require('./controllers/dropReqController');

const cors = require('cors');
const getYearSemController = require('./controllers/getYearSemController');
const getTrackCourseController = require('./controllers/getTrackCoursesController');
const getPrevTrackCourseController = require('./controllers/getPrevTrackCourseController');


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
app.get('/getCourses', getCourseController.getCoursesController)
app.post('/viewregisteredstudents', viewRegStudentsDetails.viewRegStudentsDetails)
app.post('/viewdroppedstudents', viewDroppedStudentsDetails.viewDroppedStudentsDetails)

app.post('/viewcourses', viewCoursesController.viewCoursesController)
app.post('/viewaddedtrackcourses', viewTrackCoursesController.viewTrackCoursesController)

app.post('/addcourse', courseController.insertCourse);
app.post('/addtrackcourse', trackCourseController.insertTrackCourse)

app.get('/deletecourse/:courseId', deleteCourseController.deleteCourse);
app.get('/deletetrackcourse/:courseId', deleteTrackCourseController.deleteTrackCourseController);

app.post('/approvedroprequest/:droprollno', approveDropReqController.approveRequest);

app.get('/registrations/:rollNumber', registrationController.checkRegistrationStatus);
app.post('/adminLogin', adminController.adminLogin);
app.post('/registerHonors', honorsRegController.registerHonors);
app.post('/droprequest', dropRequestController.dropRequest);
app.post('/insertStudent', studentController.insertStudent);
app.post('/updatePassword', updatePasswordController.updatePassword);
// app.get('/upload-users', userController.insertUsersFromExcel);
app.post('/loginStudent', loginController.loginUser);
app.post('/upload-users', userController.uploadStudentFile);
app.post('/upload-cgpa', cgpaController.uploadCGPAFile);
app.post('/registeredCourses/:rollNumber', viewRegCoursesController.registeredCoursesController);
app.get('/getYearSem/:rollNumber', getYearSemController.getYearSemController);
app.get('/getTrackCourses/:year/:sem/:rollNumber', getTrackCourseController.getTrackCourseController);
app.get('/getPrevTrackCourse/:year/:sem/:rollNumber', getPrevTrackCourseController.getPrevTrackCourse);



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

app.get('/viewdroprequests', (req, res) => {
  const query = 'SELECT * FROM droprequests where status = 0';  // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users: ' + err.stack);
      return res.status(500).send('Error fetching users');
    }
    res.json(results);
  });
});
app.get('/cgpa', (req, res) => {
  const query = 'SELECT * FROM cgpa';  // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users: ' + err.stack);
      return res.status(500).send('Error fetching users');
    }
    res.json(results);
  });
});

// `http://localhost:3000/students/${rollNumber}`

app.post('/students/:rollNumber', (req, res) => {  
  const rollNumber = req.params.rollNumber;
  const query = 'SELECT * FROM students WHERE rollNo = ?'; // Check if roll_number column exists

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

app.post('/users/:rollNumber', (req, res) => {
  const rollNumber = req.params.rollNumber;
  
  // SQL query to join students and cgpa tables
  const query = `
    SELECT users.email, cgpa.cgpa
    FROM users
    JOIN cgpa ON users.username = cgpa.username
    WHERE users.username = ?
  `;

  db.query(query, [rollNumber], (err, results) => {
    if (err) {
      console.error('Error fetching user data: ' + err.stack);
      return res.status(500).send('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    
    // Return combined student data and CGPA
    return res.status(200).json(results[0]); 
  });
});

// app.get('/users/:rollNumber', (req, res) => {
//   const rollNumber = req.params.rollNumber;
//   const query = 'SELECT * FROM users WHERE username = ?'; // Check if roll_number column exists

//   db.query(query, [rollNumber], (err, results) => {
//     if (err) {
//       console.error('Error fetching user data: ' + err.stack);
//       return res.status(500).send('Error fetching user');
//     }

//     if (results.length === 0) {
//       return res.status(404).send('User not found');
//     }
    
//     return res.status(200).json(results[0]); // Send the first matching user
//   });
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
