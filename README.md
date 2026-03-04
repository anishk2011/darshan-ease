# DarshanEase (MERN)

Minimal MERN app for temple darshan ticket booking with JWT auth and role-based access.

## Tech Stack
- MongoDB + Mongoose
- Express
- React (CRA)
- Node.js
- Bootstrap, Axios, React Router, React Toastify

## Roles
- `USER`: browse temples, book/cancel own bookings, donate, view own records.
- `ORGANIZER`: all USER abilities + manage temples and slots.
- `ADMIN`: all ORGANIZER abilities + view all bookings and all donations.

## Backend API
Base URL: `http://localhost:5000`

- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Temples:
  - `GET /api/temples`
  - `POST /api/temples` (`ADMIN/ORGANIZER`)
  - `PUT /api/temples/:id` (`ADMIN/ORGANIZER`)
  - `DELETE /api/temples/:id` (`ADMIN/ORGANIZER`)
- Slots:
  - `GET /api/slots?templeId=...`
  - `POST /api/slots` (`ADMIN/ORGANIZER`)
  - `PUT /api/slots/:id` (`ADMIN/ORGANIZER`)
  - `DELETE /api/slots/:id` (`ADMIN/ORGANIZER`)
- Bookings:
  - `POST /api/bookings`
  - `GET /api/bookings/me`
  - `PATCH /api/bookings/:id/cancel`
  - `GET /api/bookings` (`ADMIN`)
- Donations:
  - `POST /api/donations`
  - `GET /api/donations/me`
  - `GET /api/donations` (`ADMIN`)

## Exact Run Steps
1. Open terminal at repo root:
```bash
cd darshan-ease
```
2. Ensure MongoDB is running locally at `mongodb://127.0.0.1:27017`.
3. Backend env file:
```env
# backend/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/darshanease
JWT_SECRET=change_this_to_any_long_string
```
4. Install dependencies (if not already installed):
```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```
5. Seed initial data:
```bash
cd backend && npm run seed
```
6. Start backend:
```bash
cd backend && npm run dev
```
7. Start frontend in a second terminal:
```bash
cd frontend && npm start
```
8. Open UI:
```text
http://localhost:3000
```

## Seeded Credentials
- Admin
  - Email: `admin@darshanease.com`
  - Password: `Admin@123`
- Organizer
  - Email: `organizer@darshanease.com`
  - Password: `Organizer@123`

## Notes
- Frontend proxy is configured to backend (`http://localhost:5000`).
- Booking rules are enforced:
  - Book only if slot is active and not full.
  - Cancel sets booking status to `CANCELLED` and decrements slot `bookedCount` (minimum 0).
