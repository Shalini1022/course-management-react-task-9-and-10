import { NavLink, useNavigate } from "react-router-dom";
import { getSession, logout } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const session = getSession();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav>
      <div className="logo">AIRA Academy</div>
      <ul>
        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/courses">Courses</NavLink>
        </li>
        <li>
          <NavLink to="/progress">Progress</NavLink>
        </li>
        {session?.role === "admin" && (
          <li>
            <NavLink to="/admin">Admin Dashboard</NavLink>
          </li>
        )}
        <li>
          {session ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Logout
            </a>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
