// server.js
const express = require('express');
const bodyParser = require('body-parser'); // Middleware to parse JSON bodies
const db = require('./db');
const app = express();
const port = 3000;

// Use middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (HTML, JS) from the public folder
app.use(express.static('public'));

// API route to log page load
app.post('/log-page-load', (req, res) => {
    const { user_id, timestamp } = req.body; // Get user_id and timestamp from the request body

    // Validate data
    if (!user_id || !timestamp) {
        return res.status(400).send('User ID and timestamp are required');
    }

    // Insert page load with user ID and timestamp into the database
    const stmt = db.prepare("INSERT INTO page_loads (user_id, timestamp) VALUES (?, ?)");
    stmt.run(user_id, timestamp, (err) => {
        if (err) {
            res.status(500).send('Error logging page load');
        } else {
            res.status(200).send('Page load logged');
        }
    });
    stmt.finalize();
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});


//Add the data pull to fetch the page load counts
app.get('/data', (req, res) => {
    db.all(`SELECT DATE(timestamp) as date, COUNT(*) as count FROM page_loads GROUP BY DATE(timestamp)`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
