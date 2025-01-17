// const db = require('../models/db');
const XLSX = require('xlsx');
const mysql = require('mysql2');
const fs = require('fs');
const db = mysql.createConnection({
    host: 'localhost',      // Your MySQL server address (e.g., localhost)
    user: 'root',           // MySQL username
    password: 'aswanib', // MySQL password
    database: 'honors_registration' // Your MySQL database name
  });
  
// Controller to read data from Excel and insert into MySQL
exports.insertUsersFromExcel = async (req, res) => {
  try {
    // Path to your Excel file
    const filePath = "C:/rollno_vs_email.xlsx";

    // Read the Excel file
    const workbook = XLSX.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const worksheet = workbook.Sheets[sheet_name_list[0]]; // Assuming data is in the first sheet

    // Parse the sheet data into JSON format
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Prepare the data to insert into the MySQL table
    const users = data.map((row) => ({
      roll_no: row['Roll No'], // Adjust column name based on your Excel sheet
      email: row['Email ID'],   // Adjust column name based on your Excel sheet
    }));

    // Create an array of promises for insertion
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

    // Wait for all insertions to complete
    await Promise.all(insertPromises);

    // Respond with success
    res.send(`${users.length} users inserted successfully`);
  } catch (error) {
    console.error('Error occurred while processing the file:', error);
    res.status(500).send('Error occurred while processing the file');
  }
};
