import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../utils/auth";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const result = await registerStudent(form);

      if (!result.ok) {
        setError(result.message);
        return;
      }

      alert(result.message);
      navigate("/login");
    } catch (error) {
      console.error(error);
      setError(
        "Unable to register. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Create Account</h1>
        <p>Join us and start your learning journey.</p>

        {error && <div className="form-message error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Full Name</label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <label>Department</label>
            <input
              name="department"
              type="text"
              placeholder="Enter your department"
              value={form.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create password (minimum 8 characters)"
              value={form.password}
              onChange={handleChange}
              minLength={8}
              maxLength={72}
              required
            />
          </div>

          <div className="input-box">
            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
