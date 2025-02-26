const mysql = require('mysql2');

// Configure MySQL connection
const db = mysql.createConnection({
  host: 'localhost',      
  user: 'root',           
  password: 'aswanib',    
  database: 'honors_registration' 
});

exports.getCoursesController = (req, res) => { 
    const { year, sem, rollNumber, trackCourse } = req.query; 
    console.log("Selected track is: " + trackCourse);

    if (!year || !sem) {
        return res.status(400).send('Missing required query parameters: year and sem');
    }

    const getDepartmentQuery = 'SELECT department FROM students WHERE rollNo = ?';

    db.query(getDepartmentQuery, [rollNumber], (err, results) => {
        if (err) {
            console.error('Error fetching department:', err);
            return res.status(500).json({ message: 'Error fetching department' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const department = results[0].department;

        // Query to get regular courses
        const coursesQuery = 'SELECT course_name, course_id FROM courses WHERE year = ? AND sem = ? AND department = ?';

        db.query(coursesQuery, [year, sem, department], (err, coursesResults) => {
            if (err) {
                console.error('Error fetching courses:', err);
                return res.status(500).send('Internal Server Error');
            }

            let response = { courses: coursesResults };

            // If trackCourse is provided, fetch track courses
            if (trackCourse) {
                const trackCoursesQuery = 'SELECT course_name, course_id FROM trackcourses WHERE trackCourseName = ?';

                db.query(trackCoursesQuery, [trackCourse], (err, trackCoursesResults) => {
                    if (err) {
                        console.error('Error fetching track courses:', err);
                        return res.status(500).send('Internal Server Error');
                    }

                    response.trackCourses = trackCoursesResults;
                    res.json(response); // Send combined response
                });
            } else {
                res.json(response); // Send only courses if trackCourse is not provided
            }
        });
    });
};
