const mysql = require('mysql2');
require('dotenv').config();
const fs = require('fs');

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

const createUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    sustainability_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

const createEnvironmentalDataTable = `
  CREATE TABLE IF NOT EXISTS environmental_data (
    data_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    data_type VARCHAR(255) NOT NULL,
    value FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );
`;

const createAlertsTable = `
  CREATE TABLE IF NOT EXISTS alerts (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT NOT NULL,
    threshold FLOAT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );
`;

const createCommunityReportsTable = `
  CREATE TABLE IF NOT EXISTS community_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    issue_type VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );
`;

function createTable(query, tableName) {
    db.query(query, (err, result) => {
        if (err) {
            console.error(`Error creating ${tableName} table:`, err);
            return;
        }
        console.log(`${tableName} table created or already exists`);
    });
}

db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to the MySQL server.');

    createTable(createUserTable, "Users");
    createTable(createEnvironmentalDataTable, "Environmental Data");
    createTable(createAlertsTable, "Alerts");
    createTable(createCommunityReportsTable, "Community Reports");

    // Close the connection after a delay to ensure all tables are created
    setTimeout(() => db.end(), 2100); // Adjust the delay as needed
});