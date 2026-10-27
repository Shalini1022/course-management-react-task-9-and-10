const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  validateCreateCourse,
  validateUpdateCourse,
} = require("../middleware/courseValidation");

// Public: anyone can browse courses.
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);

// Protected: a valid JWT is required for changes.
router.post(
  "/",
  authenticateToken,
  validateCreateCourse,
  courseController.createCourse
);

router.put(
  "/:id",
  authenticateToken,
  validateUpdateCourse,
  courseController.updateCourse
);

router.delete("/:id", authenticateToken, courseController.deleteCourse);

module.exports = router;
