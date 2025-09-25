# Job Board API

A simple backend API for managing job postings with authentication and role-based access.

---

## Features
- Create, read, update, and delete job postings
- Data stored in MongoDB Atlas
- RESTful endpoints with JSON responses
- User registration with hashed passwords (bcrypt)
- User login with JWT authentication
- Protected routes: only logged-in users can create/update/delete jobs
- Role-based access control (admin vs user)
- Full-text search and filtering
- Pagination for job listings

---

## Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB Atlas** (via Mongoose)
- **JWT (JSON Web Tokens)** for authentication
- **bcrypt** for password hashing

---

## Live Demo
- Base URL: https://job-board-api-ggpo.onrender.com

- Endpoints:
   - POST /auth/register --> Register a new user
   - POST /auth/login --> Login and get JWT token
   - GET /jobs --> List all jobs (supports search, filters, pagination)
   - GET /jobs/:id --> Get one job by ID
   - POST /jobs --> Create a job (requires auth)
   - PUT /jobs/:id --> Update a job (requires auth)
   - DELETE /jobs/:id --> Delete a job (admin only)

---

## Auth Flow
- Register:
   POST https://job-board-api-ggpo.onrender.com/auth/register
Content-Type: application/json

{
  "name": "Akif",
  "email": "akif@example.com",
  "password": "StrongP@ssw0rd!"
}

- Login --> get token:
   POST https://job-board-api-ggpo.onrender.com/auth/login
Content-Type: application/json

{
  "email": "akif@example.com",
  "password": "StrongP@ssw0rd!"
}
Copy the <token> from the response.

- Add header:
   Authorization: Bearer <your-token>


## Setup

- Clone the repo:
   git clone <your-repo-url>
   cd job-board-api

- Install dependencies:
   npm install

- Create .env file:
   PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key

- Start the server: 
   npm run dev   # with nodemon  
npm start     # normal start  

