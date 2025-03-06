// src/pages/User/LoginPage.js
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import supabase from "../../services/supabaseClient";
import "./LoginPage.scss";

function LoginPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");
  const [redirectPath, setRedirectPath] = useState("/");

  // Check for redirect information in location state or URL query params
  useEffect(() => {
    // Check location state first (from programmatic redirects)
    if (location.state) {
      if (location.state.message) {
        setRedirectMessage(location.state.message);
      }
      if (location.state.from) {
        setRedirectPath(location.state.from);
      }
    }
    // Then check URL query parameters (from button redirects)
    else {
      const params = new URLSearchParams(location.search);
      const redirectParam = params.get("redirect");

      if (redirectParam) {
        setRedirectPath(redirectParam);
        setRedirectMessage("Please log in to continue");
      }
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const { error: supaError } = await supabase.auth.signInWithPassword({
        email: formState.email,
        password: formState.password,
      });
      if (supaError) {
        throw supaError;
      }

      // Redirect to the original page if available, otherwise to home
      navigate(redirectPath || "/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  // If already logged in, redirect to the original page or home
  if (isAuthenticated) {
    navigate(redirectPath || "/");
    return null;
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Log In</h2>

        {redirectMessage && (
          <div className="redirect-message">
            <p>{redirectMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={formState.password}
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
              required
            />
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="signup-link">
          <p>
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
