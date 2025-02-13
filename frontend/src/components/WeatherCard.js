// src/components/WeatherCard.js
import React from 'react';
import styles from '../styles/WeatherForecastStyles';

const WeatherCard = ({ forecast }) => {
  const cardStyles = {
    ...styles.card,
    backgroundColor: getBackgroundColor(forecast.temperatureC),
  };

  return (
    <div style={cardStyles}>
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
  );
};

// Helper function for dynamic background color based on temperature
const getBackgroundColor = (tempC) => {
  if (tempC > 30) return '#ff9999';
  if (tempC > 20) return '#ffd699';
  if (tempC > 10) return '#ffff99';
  if (tempC > 0) return '#99ff99';
  return '#99ccff';
};

export default WeatherCard;