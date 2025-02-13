using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class WeatherService(IWeatherRepository weatherRepository) : IWeatherService
    {
        private readonly IWeatherRepository _weatherRepository = weatherRepository;

        public IEnumerable<WeatherForecast> GetWeatherForecasts()
        {
            IEnumerable<WeatherForecast> forecasts = _weatherRepository.GetWeatherForecasts();
            return forecasts;
        }
    }
}
