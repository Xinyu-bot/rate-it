// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import supabase from "../services/supabaseClient";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(data.session);
        // If a user is present, extract the access token
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
    });

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
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{ session, accessToken, userId, isAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
