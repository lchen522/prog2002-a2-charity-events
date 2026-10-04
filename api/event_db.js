// =============================================================
// event_db.js - MySQL connection module for charityevents_db
// PROG2002 A2 - Charity Events Website
// =============================================================
const mysql = require('mysql2/promise');

// Connection settings - adjust user/password to match your local MySQL
const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Liuchenyu1',   // <-- CHANGE THIS to your MySQL password
    database: 'charityevents_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// A connection pool reuses connections efficiently across API requests
const pool = mysql.createPool(dbConfig);

/**
 * Test the database connection at startup and exit with a clear
 * error message if the database is unreachable.
 */
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('[event_db] Successfully connected to charityevents_db');
        connection.release();
    } catch (err) {
        console.error('[event_db] Database connection failed:', err.message);
        console.error('[event_db] Check that MySQL is running and charityevents_db is imported.');
        process.exit(1);
    }
}

module.exports = { pool, testConnection };
