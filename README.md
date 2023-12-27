# EcoTrack

EcoTrack is an environmental monitoring and reporting platform designed to track, analyze, and report on various environmental data. It allows users to submit data, manage profiles, receive alerts, and more. This platform is part of an initiative to increase awareness and active participation in environmental conservation efforts.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) - JavaScript runtime environment
- [npm](https://www.npmjs.com/) - Node Package Manager
- Access to a MySQL database (remote or local)

### Installing

1. **Clone the Repository**

   ```bash
   git clone [URL of your Git repository]
   cd EcoTrack
   ```

2. **Install Dependencies**

   Run the following command in the root directory of your project to install all required dependencies:

   ```bash
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in your root directory with the following content, replacing the values with your database credentials:

   ```plaintext
   DB_HOST=your_database_host
   DB_USER=your_database_username
   DB_PASS=your_database_password
   DB_NAME=your_database_name
   DB_PORT=your_database_port
   CA_CERT_PATH=/path/to/your/ca_certificate.pem
   ```

   Ensure that the path to your CA certificate is correct and the file is accessible.

4. **Running the Server**

   Start the server by running:

   ```bash
   node server.js
   ```

   You should see a message indicating that the server is running on a specified port.

5. **Testing the Server**

   Ensure the application functions as expected by running automated tests:

   ```bash
   npm test
   ```

   Successful tests will display messages indicating passed tests for various API endpoints.

### Usage

After starting the server, you can access the API endpoints through `http://localhost:[PORT]` where `[PORT]` is the port number your server is running on (default is 3000).

## EcoTrack API Documentation

EcoTrack offers a RESTful API for environmental monitoring and reporting, supporting various operations related to data collection, user profiles, environmental alerts, community reporting, and more.

### Data Collection

#### POST /api/data
- Description: Submit environmental data.
- Request Payload:
  ```json
  {
    "user_id": int,
    "data_type": "string",
    "value": float,
    "timestamp": "datetime",
    "location": "string"
  }
  ```
- Response: Confirmation message with the ID of the added data.

#### GET /api/data
- Description: Retrieve all environmental data.
- Response: An array of all environmental data records.

### User Profiles

#### POST /api/users
- Description: Create a new user profile.
- Request Payload:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- Response: Confirmation message with the ID of the created user.

#### GET /api/users/:id
- Description: Retrieve a specific user profile.
- URL Parameter: `id` (user ID)
- Response: User profile data for the specified ID.

### Environmental Alerts

#### POST /api/alerts
- Description: Create an environmental alert.
- Request Payload:
  ```json
  {
    "user_id": int,
    "message": "string",
    "threshold": float,
    "timestamp": "datetime"
  }
  ```
- Response: Confirmation message with the ID of the created alert.

#### GET /api/alerts
- Description: Retrieve all environmental alerts.
- Response: An array of all alert records.

### Community Reporting

#### POST /api/reports
- Description: Submit a community report on environmental issues.
- Request Payload:
  ```json
  {
    "user_id": int,
    "issue_type": "string",
    "description": "string",
    "timestamp": "datetime",
    "location": "string"
  }
  ```
- Response: Confirmation message with the ID of the created report.

#### GET /api/reports
- Description: Retrieve all community reports.
- Response: An array of all report records.

### Sustainability Score

#### GET /api/users/:id/score
- Description: Retrieve the sustainability score of a specific user.
- URL Parameter: `id` (user ID)
- Response: Sustainability score for the specified user.

### Educational Resources (Placeholder)

#### GET /api/resources
- Description: Retrieve educational resources (functionality not yet implemented).

### Open Data Access

#### GET /api/research-data
- Description: Retrieve aggregated environmental data for research purposes.
- Response: Aggregated environmental data useful for research.

## Error Handling

EcoTrack's API endpoints provide descriptive HTTP status codes and messages to handle errors effectively. This includes scenarios like invalid request parameters, database connection issues, and resource not found situations.

## Contributing

For guidelines on contributing to EcoTrack, please read [CONTRIBUTING.md](URL to your contributing guidelines).

## License

This project is currently unlicensed.

## Technologies Used

#### Node.js

**Usage:** Node.js serves as the project's runtime environment, facilitating the creation of scalable and efficient server-side applications.

#### Express

**Usage:** Express, a minimalist web application framework, simplifies API development by handling routing, middleware, and HTTP requests, streamlining the creation of RESTful endpoints.

#### MySQL

**Usage:** MySQL, a reliable relational database system, was employed to store and manage structured data, ensuring data integrity and efficient querying for user profiles, environmental data, alerts, and reports.

### npm (Node Package Manager)

**Usage:** npm simplifies dependency management by allowing the installation and maintenance of project dependencies like Express, Axios, and Jest.

#### Dotenv

**Usage:** Dotenv securely manages sensitive configuration data, such as database credentials and API keys, by loading them from a .env file into the project.

#### Jest (for testing)

**Usage:** Jest, a JavaScript testing framework, automates testing for the EcoTrack API, ensuring reliability through comprehensive test cases covering input validation, database interactions, and error handling.

####Axios
**Usage:** Axios simplifies external data integration, making HTTP requests to fetch real-time air quality, weather data, and potential educational resources for the EcoTrack platform.

## Deployment

For guidelines on deploying EcoTrack in a production environment, please refer to the deployment section.

[Optional additional sections on project background, future enhancements, etc.]