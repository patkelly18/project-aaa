// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./page_loads.db');

// Create table if it doesn't exist (with user_id and timestamp)
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS page_loads (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, timestamp TEXT)");
});

module.exports = db;




// Create a new file called db.js to set up the SQLite database.

// This script will create a table page_loads with a timestamp field where we'll store the date and time each time a page is loaded.