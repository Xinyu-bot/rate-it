namespace backend.DTOs
{
    public class WeatherDto
    {
        public required string Date { get; set; }
        public int TemperatureC { get; set; }
        public required string Summary { get; set; }
        public int TemperatureF { get; set; }
    }
}
