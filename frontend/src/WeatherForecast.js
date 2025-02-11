// src/WeatherForecast.js
import React, { useEffect, useState } from 'react';

function WeatherForecast() {
  const [forecasts, setForecasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the weather forecast from your backend API
    fetch('https://localhost:7217/weatherforecast')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        return response.json();
      })
      .then((data) => {
        setForecasts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching weather data:', err);
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
          <div key={index} style={styles.card}>
            <h2 style={styles.cardTitle}>
              {new Date(forecast.date).toLocaleDateString()}
            </h2>
            <p style={styles.cardText}>
              <strong>Temp (C):</strong> {forecast.temperatureC}°C
            </p>
            <p style={styles.cardText}>
              <strong>Temp (F):</strong> {forecast.temperatureF}°F
            </p>
            <p style={styles.cardText}>
              <strong>Summary:</strong> {forecast.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    padding: '20px',
    margin: '10px',
    width: '250px',
  },
  cardTitle: {
    marginBottom: '10px',
    color: '#2c3e50',
  },
  cardText: {
    margin: '5px 0',
  },
  message: {
    textAlign: 'center',
    fontSize: '18px',
    padding: '50px',
  },
};

export default WeatherForecast;
