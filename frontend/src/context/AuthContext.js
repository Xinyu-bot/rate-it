// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import supabase from "../services/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize from localStorage so we have an immediate value if available.
  const [session, setSession] = useState(null);
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem("accessToken") || null
  );
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || null
  );
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Retrieve session from Supabase on app load
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        if (data.session?.access_token) {
          setAccessToken(data.session.access_token);
          localStorage.setItem("accessToken", data.session.access_token);
        }
        if (data.session?.user) {
          const idFromSupabase = data.session.user.id;
          setUserId(idFromSupabase);
          localStorage.setItem("userId", idFromSupabase);
        }
      }
      setAuthLoading(false); // Auth state has been determined
    });

    // Listen for auth state changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        if (newSession?.access_token) {
          setAccessToken(newSession.access_token);
          localStorage.setItem("accessToken", newSession.access_token);
        } else {
          setAccessToken(null);
          localStorage.removeItem("accessToken");
        }

        if (newSession?.user) {
          setUserId(newSession.user.id);
          localStorage.setItem("userId", newSession.user.id);
        } else {
          setUserId(null);
          localStorage.removeItem("userId");
        }
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const isAuthenticated = !!session?.user;

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAccessToken(null);
    setUserId(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        accessToken,
        userId,
        isAuthenticated,
        authLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
