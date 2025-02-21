// src/components/NavBar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function NavBar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      <Link to="/weather" style={{ marginRight: "1rem" }}>
        Public Forecast
      </Link>
      <Link to="/authorized-forecast" style={{ marginRight: "1rem" }}>
        Authorized Forecast
      </Link>
      <Link to="/user/me" style={{ marginRight: "1rem" }}>
        My Profile
      </Link>

      {isAuthenticated ? (
        <button onClick={logout} style={{ float: "right" }}>
          Logout
        </button>
      ) : (
        <div style={{ float: "right" }}>
          <Link to="/login" style={{ marginRight: "1rem" }}>
            Login
          </Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
