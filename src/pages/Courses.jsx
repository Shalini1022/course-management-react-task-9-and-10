import { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import CourseCard from "../components/CourseCard.jsx";
import apiClient from "../api/apiClient";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchCourses() {
    try {
      setLoading(true);
      setError("");
      const response = await apiClient.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load courses. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <>
      <Navbar />

      <section className="course-section">
        <h1>Available Courses</h1>
        <p>Choose a course and start your learning journey.</p>

        {loading && <p>Loading courses...</p>}
        {!loading && error && (
          <div className="form-message error page-message">{error}</div>
        )}
        {!loading && !error && courses.length === 0 && (
          <p>No courses are available right now.</p>
        )}

        <div className="course-container">
          {!loading &&
            !error &&
            courses.map((course) => (
              <CourseCard
                key={course.id}
                image={course.image}
                alt={course.courseName}
                title={course.courseName}
                description={course.overview}
                duration={course.duration}
                courseId={course.id}
              />
            ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Courses;
