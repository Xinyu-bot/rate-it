// src/pages/SignupPage.js
import React, { useState } from "react";
import supabase from "../services/supabaseClient";

function SignupPage() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setStatus("");

    const { error } = await supabase.auth.signUp({
      email: formState.email,
      password: formState.password,
    });

    if (error) {
      setStatus(error.message);
    } else {
      // data.user should exist if sign up succeeded
      setStatus(
        "Sign Up successful! Check your email for a confirmation link (if enabled in Supabase)."
      );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Sign Up with Supabase</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Sign Up</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default SignupPage;
