const requiredText = ["courseName", "courseCode", "instructor", "duration"];

function checkFields(body, { requireAll }) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return "Course details are required";
  }

  for (const field of requiredText) {
    if (body[field] === undefined) {
      if (requireAll) return "Course name, code, instructor, and duration are required";
      continue;
    }
    if (typeof body[field] !== "string" || !body[field].trim()) {
      return `${field} must be a non-empty text value`;
    }
  }

  if (body.marks !== undefined) {
    const marks = Number(body.marks);
    if (!Number.isFinite(marks) || marks < 0) {
      return "marks must be a non-negative number";
    }
  }

  for (const field of ["learningOutcomes", "modules"]) {
    if (body[field] !== undefined && !Array.isArray(body[field])) {
      return `${field} must be a list`;
    }
  }

  return null;
}

function validateCreateCourse(req, res, next) {
  const message = checkFields(req.body, { requireAll: true });
  if (message) return res.status(400).json({ message });
  next();
}

function validateUpdateCourse(req, res, next) {
  const message = checkFields(req.body, { requireAll: false });
  if (message) return res.status(400).json({ message });
  next();
}

module.exports = {
  validateCreateCourse,
  validateUpdateCourse,
};
