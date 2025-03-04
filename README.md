TMS (Train Management System)

Overview

TMS (Train Management System) is a web application for managing train routes, passenger registration, ticket purchases, and travel history. The server is built using Node.js with Express.js and SQLite3 as the database.

Features

User Management: Registration, login, profile editing, and email verification.

Train Search: Allows users to search for train connections based on departure and destination stations.

Ticket Purchase: Enables users to buy tickets and stores travel history.

Admin Statistics: Provides data on the most used train routes and ticket types.

Technologies Used

Node.js (Express.js framework)

SQLite3 (Database management)

JWT (JSON Web Token for authentication)

Bcrypt (Password hashing)

Nodemailer (Email verification system)

Installation

Prerequisites

Node.js installed

SQLite3 installed

Setup

Clone the repository:

git clone <repository-url>

Navigate to the project folder:

cd TMS

Install dependencies:

npm install

Configure email credentials in server.js:

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email',
        pass: 'your_password'
    }
});

Run the server:

node server.js

The server will start on port 3333 by default.

API Endpoints

Authentication

POST /register - Register a new user

POST /login - Log in an existing user

GET /verify_email - Verify email via token

Train Search

POST /search - Search for train routes

Ticketing

POST /buy_ticket - Purchase a ticket

GET /travel_history - Retrieve travel history

User Profile

POST /edit_profile_info - Edit user profile

GET /get_profile_info - Get user profile information

Admin Statistics

GET /get_statistics - Retrieve statistics on train usage (admin only)

Security

Passwords are hashed using bcrypt.

Authentication is handled via JWT tokens.

API requests require a valid token for authentication.
