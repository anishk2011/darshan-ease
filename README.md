# DarshanEase – Temple Darshan Ticket Booking System

## Overview

DarshanEase is a **full-stack MERN web application** that allows devotees to explore temples, view available darshan slots, and book tickets online. The system provides a smooth and secure way to plan temple visits with real-time slot availability, booking management, and donation support.

This project is built using the **MERN stack (MongoDB, Express.js, React.js, Node.js)** and demonstrates role-based authentication, REST API design, and responsive frontend development.

---

## Features

### User Features

- User Registration and Login (JWT Authentication)
- View available temples
- View darshan slots for a selected temple
- Book darshan slots
- Cancel booked slots
- View personal booking history
- Donate to temples

### Admin / Organizer Features

- Add new temples
- Create darshan slots
- Manage temple information
- View all bookings
- View all donations

---

## Tech Stack

### Frontend
- React.js
- Bootstrap
- Axios
- React Router
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt Password Hashing

---

## Project Structure


darshan-ease
│
├── backend
│ ├── controllers
│ ├── middleware
│ ├── models
│ ├── routes
│ ├── server.js
│ └── seed.js
│
├── frontend
│ ├── public
│ ├── src
│ │ ├── components
│ │ ├── pages
│ │ └── api
│ └── package.json
│
└── README.md


---

## Installation and Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/anishk2011/darshan-ease.git
cd darshan-ease
2️⃣ Install backend dependencies
cd backend
npm install
3️⃣ Install frontend dependencies
cd ../frontend
npm install
4️⃣ Start MongoDB

Make sure MongoDB service is running.

5️⃣ Start Backend Server
cd backend
npm run dev

Backend runs on:

http://localhost:5000
6️⃣ Start Frontend Application
cd frontend
npm start

Frontend runs on:

http://localhost:3000
Seed Demo Data

To populate the database with sample data:

cd backend
npm run seed

This will create:

Admin user

Organizer user

Sample temples

Darshan slots

Security Features

JWT based authentication

Role-based access control

Password hashing using bcrypt

Protected API routes

Input validation and error handling

Author

Anish Katariya

GitHub:
https://github.com/anishk2011

License

This project is created for educational and academic purposes.