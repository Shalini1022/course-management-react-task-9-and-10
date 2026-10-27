import api from "../services/api";
import {
  registerStudent as registerStudentApi,
  loginStudent as loginStudentApi,
} from "../api/authApi";

const SESSION_KEY = "airaSession";
const TOKEN_KEY = "token";

function getErrorMessage(err, fallback) {
  // Server answered with an error (400, 401, 409...): show its message.
  if (err.response) {
    return err.response.data?.message || fallback;
  }
  // No response at all: the backend is not reachable.
  throw err;
}

export async function registerStudent({ name, email, department, password }) {
  try {
    // Task 9: POST /api/v1/auth/register
    const result = await registerStudentApi({
      name,
      email,
      department,
      password,
    });

    return {
      ok: true,
      message: result.message,
      student: result.student,
    };
  } catch (err) {
    return {
      ok: false,
      message: getErrorMessage(err, "Registration failed. Please try again."),
    };
  }
}

export async function loginStudent(email, password) {
  try {
    // Task 9 + 10: POST /api/v1/auth/login returns the student and a JWT
    const result = await loginStudentApi({ email, password });

    sessionStorage.setItem(TOKEN_KEY, result.token);
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        role: "student",
        userId: result.student.id,
        name: result.student.name,
        email: result.student.email,
      })
    );

    return {
      ok: true,
      message: result.message,
      student: result.student,
    };
  } catch (err) {
    return {
      ok: false,
      status: err.response?.status,
      message: getErrorMessage(err, "Login failed. Please try again."),
    };
  }
}

export async function loginAdmin(email, password) {
  const response = await api.get("/admins", {
    params: { email, password },
  });

  const admin = response.data[0];

  if (!admin) {
    return {
      ok: false,
      message: "Invalid Admin Email or Password",
    };
  }

  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      role: "admin",
      userId: admin.id,
      name: admin.name,
      email: admin.email,
    })
  );

  return {
    ok: true,
    message: "Admin Login Successful!",
    admin,
  };
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getSession());
}

export function isAdmin() {
  return getSession()?.role === "admin";
}

export function isStudent() {
  return getSession()?.role === "student";
}

export function getStudentId() {
  return getSession()?.role === "student" ? getSession().userId : null;
}

export function getStudentName() {
  return getSession()?.role === "student" ? getSession().name : null;
}

export async function enrollCourse(courseId) {
  const studentId = getStudentId();

  if (!studentId) {
    return { ok: false, message: "Please Login First!" };
  }

  const existing = await api.get("/enrollments", {
    params: {
      studentId,
      courseId,
    },
  });

  if (existing.data.length > 0) {
    return {
      ok: false,
      message: "You have already enrolled in this course!",
    };
  }

  await api.post("/enrollments", {
    studentId,
    courseId,
    enrolledAt: new Date().toISOString(),
  });

  return {
    ok: true,
    message: "Course enrolled successfully!",
  };
}

export async function getStudentProgress() {
  const studentId = getStudentId();

  if (!studentId) {
    return {
      score: 0,
      completed: [],
    };
  }

  const response = await api.get("/progress", {
    params: { studentId },
  });

  return {
    score: response.data.reduce(
      (total, item) => total + Number(item.marks || 0),
      0
    ),
    completed: response.data.map((item) => item.courseName),
    records: response.data,
  };
}

export async function completeCourse(courseId, courseName, marks) {
  const studentId = getStudentId();

  if (!studentId) {
    return {
      ok: false,
      message: "Please Login First!",
    };
  }

  const existing = await api.get("/progress", {
    params: {
      studentId,
      courseId,
    },
  });

  if (existing.data.length > 0) {
    return {
      ok: false,
      message: "Course already completed!",
    };
  }

  await api.post("/progress", {
    studentId,
    courseId,
    courseName,
    marks,
    completedAt: new Date().toISOString(),
  });

  const updated = await getStudentProgress();

  return {
    ok: true,
    score: updated.score,
    completed: updated.completed,
  };
}
