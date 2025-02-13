import React from "react";
import styles from "./WeatherCard.styles";

const getBackgroundColor = (temperatureC) => {
  if (temperatureC < 0) return "#00f";
  if (temperatureC < 15) return "#0ff";
  if (temperatureC < 25) return "#0f0";
  return "#f00";
};

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

export default WeatherCard;
