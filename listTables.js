const mysql = require('mysql2');
const readline = require('readline');
require('dotenv').config();
const fs = require('fs');

// Readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: {
        ca: fs.readFileSync(process.env.CA_CERT_PATH)
    }
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to the MySQL server.');

    // Query to list all tables in the database
    db.query("SHOW TABLES", (err, results) => {
        if (err) {
            console.error('Error fetching tables:', err);
            db.end();
            return;
        }

        console.log('Tables in the database:');
        results.forEach((row, index) => {
            console.log(`${index + 1}. ${row[Object.keys(row)[0]]}`);
        });

        // Prompt user to choose a table
        rl.question('Enter the number of the table to view its content: ', (answer) => {
            const tableIndex = parseInt(answer) - 1;
            if (tableIndex >= 0 && tableIndex < results.length) {
                const chosenTable = results[tableIndex][Object.keys(results[0])[0]];
                viewTableContent(chosenTable);
            } else {
                console.log('Invalid selection. Exiting.');
                db.end();
                rl.close();
            }
        });
    });
});

// Function to view content of a chosen table
function viewTableContent(tableName) {
    db.query(`SELECT * FROM ${tableName}`, (err, rows) => {
        if (err) {
            console.error(`Error fetching data from ${tableName}:`, err);
            db.end();
            rl.close();
            return;
        }

        console.log(`Contents of ${tableName}:`);
        console.table(rows);
        db.end();
        rl.close();
    });
}
