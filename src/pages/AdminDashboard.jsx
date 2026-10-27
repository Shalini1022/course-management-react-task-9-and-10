import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import api from "../services/api";
import { isAdmin } from "../utils/auth";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function fetchStudents() {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/students");
      setStudents(response.data);
    } catch (error) {
      console.error(error);
      setError(
        "Unable to load students. Please make sure the Mock API server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isAdmin()) {
      alert("Admin login required.");
      navigate("/login");
      return;
    }

    fetchStudents();
  }, [navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(student) {
    setEditingId(student.id);
    setForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      password: student.password || "",
    });
    setMessage("");
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setSaving(true);

      if (editingId) {
        const response = await api.put(`/students/${editingId}`, form);

        setStudents((current) =>
          current.map((student) =>
            student.id === editingId ? response.data : student
          )
        );

        setMessage("Student updated successfully.");
      } else {
        const duplicate = students.some(
          (student) =>
            student.email.toLowerCase() === form.email.trim().toLowerCase()
        );

        if (duplicate) {
          setError("A student with this email already exists.");
          return;
        }

        const response = await api.post("/students", {
          ...form,
          email: form.email.trim(),
        });

        setStudents((current) => [...current, response.data]);
        setMessage("Student added successfully.");
      }

      cancelEdit();
    } catch (error) {
      console.error(error);
      setError("The student could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await api.delete(`/students/${id}`);

      setStudents((current) =>
        current.filter((student) => student.id !== id)
      );

      await api
        .get("/enrollments", { params: { studentId: id } })
        .then(async (response) => {
          await Promise.all(
            response.data.map((item) => api.delete(`/enrollments/${item.id}`))
          );
        });

      await api
        .get("/progress", { params: { studentId: id } })
        .then(async (response) => {
          await Promise.all(
            response.data.map((item) => api.delete(`/progress/${item.id}`))
          );
        });

      setMessage("Student deleted successfully.");
    } catch (error) {
      console.error(error);
      setError("The student could not be deleted. Please try again.");
    }
  }

  return (
    <>
      <Navbar />

      <section className="admin-section">
        <div className="admin-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage student records using the local Mock API.</p>
          </div>
          <button className="secondary-btn" onClick={fetchStudents}>
            Refresh
          </button>
        </div>

        {error && <div className="form-message error">{error}</div>}
        {message && <div className="form-message success">{message}</div>}

        <div className="admin-grid">
          <div className="admin-form-card">
            <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <label>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-box">
                <label>Password</label>
                <input
                  name="password"
                  type="text"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="login-btn" type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Student"
                    : "Add Student"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="secondary-btn full-btn"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>

          <div className="admin-table-card">
            <h2>Student Records</h2>

            {loading && <p>Loading students...</p>}

            {!loading && students.length === 0 && (
              <p>No student records found.</p>
            )}

            {!loading && students.length > 0 && (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phone}</td>
                        <td>
                          <button
                            className="table-btn edit-btn"
                            onClick={() => startEdit(student)}
                          >
                            Edit
                          </button>
                          <button
                            className="table-btn delete-btn"
                            onClick={() => handleDelete(student.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default AdminDashboard;
