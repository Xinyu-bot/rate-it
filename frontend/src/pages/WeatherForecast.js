// src/WeatherForecast.js
import React, { useEffect, useState } from "react";
import styles from "./WeatherForecast.styles";
import WeatherCard from "../components/WeatherCard/WeatherCard";

function WeatherForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/weather/forecast`)
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Network response was not ok");
        }
        return response.json();
      })
      .then(({ data }) => {
        // Destructure the data from response
        setForecasts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={styles.message}>Loading weather forecast...</div>;
  }

  if (error) {
    return <div style={styles.message}>Error: {error.message}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Weather Forecast</h1>
      <div style={styles.cardContainer}>
        {forecasts.map((forecast, index) => (
          <WeatherCard key={index} forecast={forecast} />
        ))}
      </div>
    </div>
  );
}

export default WeatherForecast;
