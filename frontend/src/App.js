import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/User/LoginPage";
import SignupPage from "./pages/User/SignupPage";
import MyProfilePage from "./pages/User/MyProfilePage";
import WeatherForecast from "./pages/WeatherForecast/WeatherForecast";
import AuthorizedWeatherForecast from "./pages/WeatherForecast/AuthorizedWeatherForecast";

function App() {
  return (
    <Router>
      {/* Global NavBar, always visible */}
      <NavBar />

      {/* Define routes for different pages */}
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/weather" element={<WeatherForecast />} />
        <Route
          path="/authorized-forecast"
          element={<AuthorizedWeatherForecast />}
        />
        <Route path="/user/me" element={<MyProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
