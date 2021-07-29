const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
        throw "Failed to open database"
    }
    db.exec('CREATE TABLE IF NOT EXISTS biostat (name TEXT, sex TEXT, age INTEGER, height INTEGER, weight INTEGER, id text primary key)');
    console.log('Connected to database.');
});

module.exports.db = db;