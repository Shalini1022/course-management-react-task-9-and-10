# AIRA Academy — React + Express API (Tasks 9 & 10)

```text
course-management-react/
├── backend/                  <- NEW: Express API (CommonJS)
│   ├── config/corsOptions.js
│   ├── controllers/          authController.js, courseController.js
│   ├── data/                 students.js (in memory), courses.js (seeded)
│   ├── middleware/           authValidation, authMiddleware (JWT), courseValidation,
│   │                         errorMiddleware, notFoundMiddleware
│   ├── routes/               authRoutes.js, courseRoutes.js
│   ├── services/             authService.js, courseService.js
│   ├── .env  /  .env.example
│   └── server.js
├── mock-api/db.json          json-server (admin login, admin student list, enrollments, progress)
└── src/
    ├── api/apiClient.js      NEW: Axios client + JWT interceptor
    ├── api/authApi.js        NEW: registerStudent / loginStudent
    ├── services/api.js       json-server client (now port 5001)
    └── pages/ ...            Register, Login, Courses, Progress updated
```

## Ports

| Server | Port | Command (from project root) |
| --- | --- | --- |
| Express backend (`/api/v1`) | 5000 | `npm run backend` |
| json-server (legacy mock) | 5001 | `npm run api` |
| React (Vite) | 5173 | `npm run dev` |

## First-time setup

```powershell
npm install                 # frontend
cd backend
npm install                 # backend
```

Open the `backend/.env` file. A random `JWT_SECRET` is already generated; generate your own with
`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
Never commit `.env` (it is in `.gitignore`).

## Run (3 terminals)

```powershell
npm run backend     # Terminal 1 - Express on :5000
npm run api         # Terminal 2 - json-server on :5001
npm run dev         # Terminal 3 - React on :5173
```

## API

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | /api/v1/auth/register | Public |
| POST | /api/v1/auth/login | Public (returns JWT) |
| GET | /api/v1/courses | Public |
| GET | /api/v1/courses/:id | Public |
| POST | /api/v1/courses | JWT required |
| PUT | /api/v1/courses/:id | JWT required |
| DELETE | /api/v1/courses/:id | JWT required |

Send the token as `Authorization: Bearer <token>`.

## Postman tests (Task 9 Tests A–D, Task 10 Activity 9)

1. POST `/auth/register` `{ "name": "Arun Kumar", "email": "arun@example.com", "password": "LearnSecure123", "department": "Computer Science" }` -> 201
2. Same request again -> 409 "Email is already registered"
3. POST `/auth/login` with correct password -> 200 + `token`
4. POST `/auth/login` with `WrongPassword123` -> 401 "Invalid email or password"
5. GET `/courses` with no token -> 200
6. POST/PUT/DELETE `/courses` with no token -> 401
7. POST `/courses` with `Bearer <token>` and body `{ "courseName": "Data Science", "courseCode": "DS101", "instructor": "Dr. Ravi", "duration": "6 Weeks" }` -> 201
8. Any write with `Bearer abc.def.ghi` -> 401 "Invalid or expired token"

## Important notes

- Students are stored **in memory**: restarting the backend clears registered students and any courses you created/edited. Register again after a restart.
- Login issues a JWT (default 1h). The token is kept in `sessionStorage` (learning-demo approach, not production-grade).
- Any logged-in student can create/update/delete courses (authentication only, no admin role yet).
- The admin account (admin@aira.com / admin123) and Admin Dashboard still use json-server, so the dashboard lists json-server students, not students registered through the Express API.
