import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { completeCourse, getStudentProgress, isStudent } from "../utils/auth";
import apiClient from "../api/apiClient";

function Progress() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProgress() {
    try {
      setLoading(true);
      setError("");

      const [courseResponse, progressData] = await Promise.all([
        apiClient.get("/courses"),
        getStudentProgress(),
      ]);

      setCourses(courseResponse.data);
      setScore(progressData.score);
      setCompleted(progressData.completed);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load your progress. Please make sure the backend and Mock API servers are running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isStudent()) {
      alert("Please Login First");
      navigate("/login");
      return;
    }

    loadProgress();
  }, [navigate]);

  async function handleComplete(course) {
    try {
      const result = await completeCourse(
        course.id,
        course.courseName,
        course.marks
      );

      if (!result.ok) {
        alert(result.message);
        return;
      }

      setScore(result.score);
      setCompleted(result.completed);
    } catch (error) {
      console.error(error);
      alert("Unable to update progress right now.");
    }
  }

  return (
    <>
      <Navbar />

      <section className="progress-section">
        <h1>My Learning Progress</h1>
        <p>Complete your enrolled courses and earn points.</p>

        {loading && <p>Loading your progress...</p>}
        {!loading && error && (
          <div className="form-message error page-message">{error}</div>
        )}

        {!loading && !error && (
          <>
            <div className="score-card">
              <h2>Total Score</h2>
              <h1>{score}</h1>
            </div>

            {courses.length === 0 && <p>No courses available.</p>}

            {courses.map((course) => {
              const done = completed.includes(course.courseName);

              return (
                <div className="course" key={course.id}>
                  <h3>{course.courseName}</h3>
                  <p>Status : {done ? "Completed" : "Not Completed"}</p>
                  <button
                    onClick={() => handleComplete(course)}
                    disabled={done}
                    style={
                      done
                        ? { background: "green", cursor: "not-allowed" }
                        : undefined
                    }
                  >
                    {done ? "✔ Completed" : "Mark as Completed"}
                  </button>
                </div>
              );
            })}
          </>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Progress;
