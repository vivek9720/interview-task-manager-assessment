# Interview Task Manager

A full-stack web app to manage interview preparation tasks — built with the MERN stack.

## What it does

- Create an account and log in securely
- Add tasks like "Practice DSA", "System Design Study", "Mock Interview"
- Mark tasks as Pending or Completed
- Edit or delete any task
- Search tasks by name and filter by status

---

## Tech Stack

| Layer      | Technology                  |
|------------|-----------------------------|
| Frontend   | React + Vite + Tailwind CSS |
| Backend    | Node.js + Express           |
| Database   | MongoDB + Mongoose          |
| Auth       | JWT + bcryptjs              |

---

## Project Structure

```
interview-task-manager/
├── client/                  # React frontend
│   └── src/
│       ├── api/             # axios instance + API functions
│       ├── components/      # Navbar, TaskCard, TaskForm
│       ├── context/         # AuthContext
│       └── pages/           # Login, Signup, Dashboard
│
└── server/                  # Express backend
    ├── config/              # DB connection
    ├── controllers/         # auth + task logic
    ├── middleware/          # JWT protect + input validation
    ├── models/              # User + Task schemas
    └── routes/              # auth + task routes
```

---

## Local Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd interview-task-manager
```

### 2. Set up the server

```bash
cd server
npm install
cp .env.example .env
# Edit .env — add your MONGO_URI and set a JWT_SECRET
npm run dev
```

### 3. Set up the client

```bash
cd ../client
npm install
npm run dev
```

App runs at `http://localhost:5173`. Backend runs at `http://localhost:5000`.

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/interview-task-manager
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
```

---

## API Documentation

### Auth

| Method | Endpoint          | Body                          | Description          |
|--------|-------------------|-------------------------------|----------------------|
| POST   | /api/auth/signup  | name, email, password         | Register new user    |
| POST   | /api/auth/login   | email, password               | Login, returns JWT   |

### Tasks (all require `Authorization: Bearer <token>`)

| Method | Endpoint         | Body / Query                     | Description          |
|--------|------------------|----------------------------------|----------------------|
| GET    | /api/tasks       | ?status=Pending&search=dsa       | Get all user tasks   |
| POST   | /api/tasks       | title, description, status       | Create a task        |
| GET    | /api/tasks/:id   | —                                | Get one task         |
| PUT    | /api/tasks/:id   | title, description, status       | Update a task        |
| DELETE | /api/tasks/:id   | —                                | Delete a task        |

---

## Notes

- Passwords are hashed with bcrypt (10 salt rounds) before saving
- JWT tokens expire after 7 days
- Tasks are user-scoped — users can only see and manage their own tasks
- Search and status filter are handled server-side via query params
