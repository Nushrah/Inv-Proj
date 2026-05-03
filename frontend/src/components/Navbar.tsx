import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="brand">
          Portfolio Dashboard
        </Link>
        <nav className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
        </nav>
        <div className="nav-user">
          <span className="muted">{user?.name}</span>
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
