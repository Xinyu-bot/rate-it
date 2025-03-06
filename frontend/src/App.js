import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/Home/HomePage";
import EntityDetailPage from "./pages/Entity/EntityDetailPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import MyProfilePage from "./pages/User/MyProfilePage";
import UserProfilePage from "./pages/User/UserProfilePage";

function App() {
  return (
    <Router>
      {/* Global NavBar, always visible */}
      <NavBar />

      {/* Define routes for different pages */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entity/:id" element={<EntityDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/user/me" element={<MyProfilePage />} />
        <Route path="/user/:userId" element={<UserProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
