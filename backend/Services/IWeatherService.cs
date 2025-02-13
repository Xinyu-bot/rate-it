using backend.Models;

namespace backend.Services
{
    public interface IWeatherService
    {
        IEnumerable<WeatherForecast> GetWeatherForecasts();
    }
}
