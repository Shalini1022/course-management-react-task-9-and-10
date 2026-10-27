import axios from "axios";

// Legacy Mock API (json-server): admin login, student admin, enrollments, progress.
// The Express backend now owns port 5000, so json-server runs on 5001.
const api = axios.create({
  baseURL: import.meta.env.VITE_MOCK_API_URL || "http://localhost:5001",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
