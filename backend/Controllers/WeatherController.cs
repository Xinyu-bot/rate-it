using backend.Services;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using System.Text.Json;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherController(IWeatherService weatherService) : ControllerBase
    {
        private readonly IWeatherService _weatherService = weatherService;
        private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        [HttpGet("authorize-forecast")]
        [Authorize]
        public IActionResult GetWeatherForecasts()
        {
            var forecasts = _weatherService.GetWeatherForecasts();
            if (forecasts == null)
            {
                return NotFound();
            }
            else
            {
                var retList = new List<WeatherDto>();
                foreach (var forecast in forecasts)
                {
                    retList.Add(new WeatherDto
                    {
                        Date = forecast.Date.ToString("yyyy-MM-dd"),
                        TemperatureC = forecast.TemperatureC,
                        Summary = forecast.Summary ?? "No summary available",
                        TemperatureF = forecast.TemperatureF
                    });
                }
                var ret = new Response<List<WeatherDto>>(0, "Success", retList);
                return Ok(ret);
            }
        }

        [HttpGet("forecast")]
        [AllowAnonymous]
        public IActionResult GetWeatherForecastsUnauthorized()
        {
            var forecasts = _weatherService.GetWeatherForecasts();
            if (forecasts == null)
            {
                return NotFound();
            }
            else
            {
                var retList = new List<WeatherDto>();
                foreach (var forecast in forecasts)
                {
                    retList.Add(new WeatherDto
                    {
                        Date = forecast.Date.ToString("yyyy-MM-dd"),
                        TemperatureC = forecast.TemperatureC,
                        Summary = forecast.Summary ?? "No summary available",
                        TemperatureF = forecast.TemperatureF
                    });
                }
                var ret = new Response<List<WeatherDto>>(0, "Success", retList);
                return Ok(ret);
            }
        }
    }
}
