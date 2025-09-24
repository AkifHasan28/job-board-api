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

## Setup

1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd job-board-api
