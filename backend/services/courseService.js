const courses = require("../data/courses");

function httpError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function getAllCourses() {
  return courses;
}

function getCourseById(id) {
  const course = courses.find((item) => String(item.id) === String(id));

  if (!course) {
    throw httpError("Course not found", 404);
  }

  return course;
}

function nextId() {
  const maxId = courses.reduce(
    (max, item) => Math.max(max, Number(item.id) || 0),
    0
  );
  return String(maxId + 1);
}

function assertUniqueCode(courseCode, ignoreId) {
  const duplicate = courses.find(
    (item) =>
      item.courseCode.toLowerCase() === courseCode.trim().toLowerCase() &&
      String(item.id) !== String(ignoreId)
  );

  if (duplicate) {
    throw httpError("A course with this course code already exists", 409);
  }
}

function createCourse(data) {
  assertUniqueCode(data.courseCode);

  const course = {
    id: nextId(),
    courseName: data.courseName.trim(),
    courseCode: data.courseCode.trim(),
    instructor: data.instructor.trim(),
    duration: data.duration.trim(),
    level: data.level || "Beginner",
    category: data.category || "General",
    image: data.image || "",
    status: data.status || "Active",
    overview: data.overview || "",
    learningOutcomes: data.learningOutcomes || [],
    modules: data.modules || [],
    marks: data.marks !== undefined ? Number(data.marks) : 0,
  };

  courses.push(course);
  return course;
}

function updateCourse(id, data) {
  const course = getCourseById(id);

  if (data.courseCode !== undefined) {
    assertUniqueCode(data.courseCode, id);
  }

  const allowed = [
    "courseName",
    "courseCode",
    "instructor",
    "duration",
    "level",
    "category",
    "image",
    "status",
    "overview",
    "learningOutcomes",
    "modules",
    "marks",
  ];

  allowed.forEach((key) => {
    if (data[key] !== undefined) {
      course[key] = typeof data[key] === "string" ? data[key].trim() : data[key];
    }
  });

  if (course.marks !== undefined) course.marks = Number(course.marks);

  return course;
}

function deleteCourse(id) {
  const index = courses.findIndex((item) => String(item.id) === String(id));

  if (index === -1) {
    throw httpError("Course not found", 404);
  }

  const [removed] = courses.splice(index, 1);
  return removed;
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
