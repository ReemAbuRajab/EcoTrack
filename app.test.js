const request = require('supertest');
const { app, db } = require('./server'); // Import db along with the app

describe('API Endpoints', () => {
    // Test User Registration
    it('should create a new user', async () => {
        const uniqueEmail = `test_${Date.now()}@example.com`; // Generates a unique email
        const res = await request(app)
            .post('/api/users')
            .send({
                username: 'testuser',
                email: uniqueEmail,
                password: 'password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
    });

    // Test Data Submission
    it('should submit environmental data', async () => {
        const timestamp = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
        const res = await request(app)
            .post('/api/data')
            .send({
                user_id: 1,
                data_type: 'Air Quality',
                value: 42,
                timestamp: timestamp,
                location: 'Test Location'
            });
        expect(res.statusCode).toEqual(201);
    });

    // Test Retrieving Data
    it('should retrieve all environmental data', async () => {
        const res = await request(app)
            .get('/api/data');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    // Test User Retrieval
    it('should retrieve a user', async () => {
        const res = await request(app)
            .get('/api/users/1'); // Assuming user_id 1 exists
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('username');
    });

    // Test Alert Creation
    it('should create an alert', async () => {
        const timestamp = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
        const res = await request(app)
            .post('/api/alerts')
            .send({
                user_id: 1, // Ensure this user_id exists in your test database
                message: 'Test Alert',
                threshold: 5,
                timestamp: timestamp
            });
        expect(res.statusCode).toEqual(201);
    });

    // Test Alert Retrieval
    it('should retrieve all alerts', async () => {
        const res = await request(app).get('/api/alerts');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    // Test Community Report Creation
    it('should create a community report', async () => {
        const timestamp = new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');
        const res = await request(app)
            .post('/api/reports')
            .send({
                user_id: 1, // Ensure this user_id exists in your test database
                issue_type: 'Pollution',
                description: 'Test Description',
                timestamp: timestamp,
                location: 'Test Location'
            });
        expect(res.statusCode).toEqual(201);
    });

    // Test Community Report Retrieval
    it('should retrieve all community reports', async () => {
        const res = await request(app).get('/api/reports');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    // Test Retrieving User Sustainability Score
    it('should retrieve a user sustainability score', async () => {
        const res = await request(app)
            .get('/api/users/1/score'); // Replace with a valid user_id
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('score');
    });

    // Add tests for /api/resources and /api/research-data if needed
});

afterAll(() => {
    db.end(); // Close the database connection after tests
});