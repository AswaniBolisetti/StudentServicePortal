const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'aswanib',
  database: 'honors_registration',
});

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    }),
});

// File upload endpoint
exports.uploadStudentFile = (req, res) => {
    const uploadSingle = upload.single('studentFile');

    uploadSingle(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send({ message: 'Error uploading file' });
        }

        const filePath = path.join(__dirname, req.file.filename);

        // Call the function to insert data into the database
        exports.insertUsersFromExcel({ filePath }, res);
    });
};
exports.insertUsersFromExcel = async (req, res) => {
  try {
    const filePath = req.filePath; // File path passed from the upload handler

    const workbook = XLSX.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]];

    const data = XLSX.utils.sheet_to_json(worksheet);

    const users = data.map((row) => ({
      roll_no: row['Roll No'],
      email: row['Email ID'],
    }));

    const insertPromises = users.map((user) => {
      return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users (username, email, role_id) VALUES (?, ?, ?)';
        db.query(query, [user.roll_no, user.email, 1], (err, results) => {
          if (err) {
            console.error('Error inserting user:', err.stack);
            reject('Error inserting user');
          } else {
            resolve(results);
          }
        });
      });
    });

    await Promise.all(insertPromises);

    res.send({ message: `${users.length} users inserted successfully` });
  } catch (error) {
    console.error('Error occurred while processing the file:', error);
    res.status(500).send({ message: 'Error occurred while processing the file' });
  }
};
