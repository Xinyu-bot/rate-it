// src/pages/LoginPage.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import supabase from "../services/supabaseClient";

function LoginPage() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const { data, error: supaError } = await supabase.auth.signInWithPassword(
        {
          email: formState.email,
          password: formState.password,
        }
      );
      if (supaError) {
        throw supaError;
      }

      // If successful, onAuthStateChange in AuthContext will set the session
      console.log("Login successful:", data.user.id);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  // If already logged in, redirect or show a message
  if (isAuthenticated) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>You are already logged in!</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Log In with Supabase</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={formState.email}
            onChange={(e) =>
              setFormState({ ...formState, email: e.target.value })
            }
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formState.password}
            onChange={(e) =>
              setFormState({ ...formState, password: e.target.value })
            }
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginPage;
