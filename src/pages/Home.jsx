import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

function Home() {
  return (
    <>
      <Navbar />

      <section className="hero">
        <div className="hero-text">
          <h1>
            AIRA Academy's Student Course Management &amp; Learning Progress
            Tracking System
          </h1>
          <p>
            Learn smarter by enrolling in courses, tracking your learning
            progress, completing modules, and achieving higher scores. Start
            your journey towards success with AIRA Academy.
          </p>
          <Link to="/register" className="btn">Get Started</Link>
          <Link to="/courses" className="btn">Explore Courses</Link>
        </div>
      </section>

      <section className="features">
        <h2>Course Features</h2>
        <div className="feature-box">
          <div className="card">
            <h3>📚 Browse Courses</h3>
            <p>Explore a variety of technical and professional courses.</p>
          </div>
          <div className="card">
            <h3>📝 Easy Enrollment</h3>
            <p>Register and enroll in your favorite course with one click.</p>
          </div>
          <div className="card">
            <h3>📈 Learning Progress</h3>
            <p>Complete modules and monitor your learning score.</p>
          </div>
          <div className="card">
            <h3>🔔 Notifications</h3>
            <p>Stay updated with announcements and course information.</p>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About AIRA Academy</h2>
        <p>
          The Student Course Management and Learning Progress Tracking
          System is a web-based platform that enables students to register,
          log in, enroll in courses, monitor learning progress, complete
          course modules, and improve their scores. It also helps
          administrators efficiently manage courses and student learning
          activities through a centralized system.
        </p>
      </section>

      <section className="features">
        <h2>Why Choose AIRA Academy?</h2>
        <div className="feature-box">
          <div className="card">
            <h3>👨‍🏫 Expert Trainers</h3>
            <p>Learn from experienced professionals with practical knowledge.</p>
          </div>
          <div className="card">
            <h3>💻 Online Learning</h3>
            <p>Access your courses anytime and anywhere.</p>
          </div>
          <div className="card">
            <h3>🏆 Skill Development</h3>
            <p>Improve your technical and professional skills.</p>
          </div>
          <div className="card">
            <h3>📜 Certificates</h3>
            <p>Earn certificates after successfully completing courses.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
