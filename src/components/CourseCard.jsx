import { useNavigate } from "react-router-dom";
import { enrollCourse, isLoggedIn } from "../utils/auth";

function CourseCard({ image, alt, title, description, duration, courseId }) {
  const navigate = useNavigate();

  async function handleEnroll() {
    if (!isLoggedIn()) {
      alert("Please Login First!");
      navigate("/login");
      return;
    }

    try {
      const result = await enrollCourse(courseId);

      if (result.ok) {
        alert(result.message);
        navigate("/progress");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to enroll right now. Please try again.");
    }
  }

  return (
    <div className="course-card">
      <img src={image} alt={alt} />
      <div className="course-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <span>Duration : {duration}</span>
        <button onClick={handleEnroll}>Enroll Now</button>
      </div>
    </div>
  );
}

export default CourseCard;
