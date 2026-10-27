import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin, loginStudent } from "../utils/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (email.trim() === "" || password === "") {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      // Student login: POST /api/v1/auth/login (returns a JWT).
      const studentResult = await loginStudent(email.trim(), password);

      if (studentResult.ok) {
        setMessage(studentResult.message);
        navigate("/courses");
        return;
      }

      // 400 = invalid input: show the server's message.
      if (studentResult.status === 400) {
        setError(studentResult.message);
        return;
      }

      // Not a student account: try the admin account (still on the Mock API).
      const adminResult = await loginAdmin(email.trim(), password);

      if (adminResult.ok) {
        navigate("/admin");
        return;
      }

      setError(studentResult.message || "Invalid email or password");
    } catch (error) {
      console.error(error);
      setError(
        "Unable to connect to the server. Please make sure the backend and Mock API are running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back!</h1>
        <p>Login to continue your learning journey.</p>

        {message && <div className="form-message success">{message}</div>}
        {error && <div className="form-message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="options">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="#" onClick={(e) => e.preventDefault()}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-link">
          Don't have an account? <Link to="/register">Register Now</Link>
        </div>

        <p className="demo-login">
          Admin demo: <strong>admin@aira.com</strong> /{" "}
          <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}

export default Login;
