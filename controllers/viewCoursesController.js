require('dotenv').config();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

// Configure MySQL connection
const db = require('../db');

// Controller to handle admin login
exports.viewCoursesController = (req, res) => {
    const query = 'SELECT * FROM courses';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching courses:', err);
            return res.status(500).json({ message: 'Failed to retrieve courses' });
        }

        // Send the results back to the frontend
        res.status(200).json(results);
    });
};
