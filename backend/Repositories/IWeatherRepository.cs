using backend.Models;

namespace backend.Repositories
{
    public interface IWeatherRepository
    {
        IEnumerable<WeatherForecast> GetWeatherForecasts();
    }
}
