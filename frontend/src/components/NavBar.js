// src/components/NavBar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./NavBar.scss";

function NavBar() {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-text">RateIt</span>
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/user/me" className="nav-link">
              My Profile
            </Link>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <button onClick={logout} className="auth-button logout-button">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="auth-button login-button">
                Login
              </Link>
              <Link to="/signup" className="auth-button signup-button">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
