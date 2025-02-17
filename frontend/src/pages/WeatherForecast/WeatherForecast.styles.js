// src/styles/WeatherForecastStyles.js
const WeatherForecastStyles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '30px',
      fontSize: '2.5rem',
    },
    cardContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      justifyContent: 'center',
    },
    message: {
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '50px',
      color: '#666',
    },
  };
  
  export default WeatherForecastStyles;