// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import supabase from "../services/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Get the current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // 2. Listen for auth state changes (login, logout)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    // Cleanup on unmount
    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!session?.user;
  const user = session?.user || null;
  const accessToken = session?.access_token || null;

  // We'll expose some helper functions
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null); // onAuthStateChange should also set null
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
