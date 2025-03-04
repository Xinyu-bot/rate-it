import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/User/LoginPage";
import SignupPage from "./pages/User/SignupPage";
import MyProfilePage from "./pages/User/MyProfilePage";

function App() {
  return (
    <Router>
      {/* Global NavBar, always visible */}
      <NavBar />

      {/* Define routes for different pages */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user/me" element={<MyProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
