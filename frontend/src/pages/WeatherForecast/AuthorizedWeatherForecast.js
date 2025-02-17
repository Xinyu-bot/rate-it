// src/pages/WeatherForecast/AuthorizedWeatherForecast.js
import React, { useEffect, useState, useContext } from "react";
import styles from "./WeatherForecast.styles";
import { AuthContext } from "../../context/AuthContext";
import WeatherCard from "../../components/WeatherCard/WeatherCard";

function AuthorizedWeatherForecast() {
  const { isAuthenticated, accessToken } = useContext(AuthContext);
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setError(
        new Error("User must be logged in to view authorized forecasts.")
      );
      setLoading(false);
      return;
    }

    fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/weather/authorize-forecast`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Network response was not ok");
        }
        return response.json();
      })
      .then(({ data }) => {
        setForecasts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setError(err);
        setLoading(false);
      });
  }, [isAuthenticated, accessToken]);

  if (loading) {
    return <div style={styles.message}>Loading weather forecast...</div>;
  }

  if (error) {
    return <div style={styles.message}>Error: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Authorized Weather Forecast</h1>
      <div style={styles.cardContainer}>
        {forecasts.map((forecast, index) => (
          <WeatherCard key={index} forecast={forecast} />
        ))}
      </div>
    </div>
  );
}

export default AuthorizedWeatherForecast;
