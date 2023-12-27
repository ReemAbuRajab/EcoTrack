const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to the MySQL server.');
});

// Data Collection Routes
app.post('/api/data', (req, res) => {
  const { user_id, data_type, value, timestamp, location } = req.body;
  const query = `INSERT INTO environmental_data (user_id, data_type, value, timestamp, location) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [user_id, data_type, value, timestamp, location], (err, result) => {
    if (err) {
      console.error("Error saving data:", err);
      res.status(500).send('Error saving data');
      return;
    }
    res.status(201).send(`Data added with ID: ${result.insertId}`);
  });
});

app.get('/api/data', (req, res) => {
  const query = `SELECT * FROM environmental_data`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving data');
      return;
    }
    res.status(200).json(results);
  });
});

// User Profile Routes
app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;
  const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

  db.query(query, [username, email, password], (err, result) => {
    if (err) {
      console.error("Error in /api/users:", err);
      res.status(500).send('Error registering user');
      return;
    }
    res.status(201).json({ message: "User created", id: result.insertId });
  });
});

app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE user_id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving user');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).json(result[0]);
  });
});

// Environmental Alerts Routes
app.post('/api/alerts', (req, res) => {
  const { user_id, message, threshold, timestamp } = req.body;
  const query = `INSERT INTO alerts (user_id, message, threshold, timestamp) VALUES (?, ?, ?, ?)`;

  db.query(query, [user_id, message, threshold, timestamp], (err, result) => {
    if (err) {
      console.error("Error saving alert:", err);
      res.status(500).send('Error saving alert');
      return;
    }
    res.status(201).send(`Alert created with ID: ${result.insertId}`);
  });
});

app.get('/api/alerts', (req, res) => {
  const query = `SELECT * FROM alerts`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving alerts');
      return;
    }
    res.status(200).json(results);
  });
});

// Community Reporting Routes
app.post('/api/reports', (req, res) => {
  const { user_id, issue_type, description, timestamp, location } = req.body;
  const query = `INSERT INTO community_reports (user_id, issue_type, description, timestamp, location) VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [user_id, issue_type, description, timestamp, location], (err, result) => {
    if (err) {
      console.error("Error saving report:", err);
      res.status(500).send('Error saving report');
      return;
    }
    res.status(201).send(`Report created with ID: ${result.insertId}`);
  });
});

app.get('/api/reports', (req, res) => {
  const query = `SELECT * FROM community_reports`;

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving reports');
      return;
    }
    res.status(200).json(results);
  });
});

// Sustainability Score Route
app.get('/api/users/:id/score', (req, res) => {
  const { id } = req.params;
  const query = `SELECT sustainability_score FROM users WHERE user_id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      res.status(500).send('Error retrieving score');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.status(200).json({ score: result[0].sustainability_score });
  });
});

app.get('/api/resources', async (req, res) => {
  try {
    const response = await axios.get(`http://api.airvisual.com/v2/city?city=Berlin&state=Berlin&country=Germany&key=54da5f8c-c2c1-4f96-9da6-d3d7b3e4023f`);

    // Format the response data as needed
    const formattedResponse = {
      city: response.data.city,
      state: response.data.state,
      country: response.data.country,
      airQuality: response.data.data.current.pollution,
      weather: response.data.data.current.weather
    };

    res.status(200).json(formattedResponse);
  } catch (error) {
    console.error("Error fetching data from AirVisual API:", error);
    res.status(500).send('Error fetching educational resources');
  }
});

// Open Data Access Route
app.get('/api/research-data', (req, res) => {
  const query = "SELECT data_type, AVG(value) as average_value FROM environmental_data GROUP BY data_type";

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving research data');
      return;
    }
    res.status(200).json(results);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).send('Internal Server Error');
});

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = { app, db };
