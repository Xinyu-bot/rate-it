using System.Diagnostics;
using System.Text;
using System.Text.Json;

namespace backend.Middleware
{
    public class LoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly JsonSerializerOptions _jsonOptions;

        public LoggingMiddleware(RequestDelegate next)
        {
            _next = next;
            _jsonOptions = new JsonSerializerOptions
            {
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
                WriteIndented = false
            };
        }

        public async Task Invoke(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();

            // Capture request details
            var request = await CaptureRequest(context);

            // Capture original response stream and replace with buffer
            var originalResponseBody = context.Response.Body;
            using var responseBuffer = new MemoryStream();
            context.Response.Body = responseBuffer;

            await _next(context);

            stopwatch.Stop();

            // Capture response details
            var response = await CaptureResponse(context, responseBuffer, originalResponseBody);

            var logEntry = new
            {
                Timestamp = DateTime.UtcNow,
                Request = request,
                Response = response,
                ElapsedMilliseconds = stopwatch.ElapsedMilliseconds
            };

            await WriteLogEntry(logEntry);
        }

        private static async Task<object> CaptureRequest(HttpContext context)
        {
            // Ensure the request body can be read multiple times
            context.Request.EnableBuffering();

            var buffer = new byte[Convert.ToInt32(context.Request.ContentLength ?? 0)];
            await context.Request.Body.ReadAsync(buffer, 0, buffer.Length);
            var body = Encoding.UTF8.GetString(buffer);

            // Reset the request body stream position so the next middleware can read it
            context.Request.Body.Position = 0;

            return new
            {
                Path = context.Request.Path,
                Query = context.Request.QueryString.ToString(),
                Headers = context.Request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
                Method = context.Request.Method,
                Body = body
            };
        }

        private async Task<object> CaptureResponse(HttpContext context, MemoryStream responseBuffer, Stream originalResponseBody)
        {
            responseBuffer.Seek(0, SeekOrigin.Begin);
            var responseBody = await new StreamReader(responseBuffer).ReadToEndAsync();

            // Copy buffer to original stream
            responseBuffer.Seek(0, SeekOrigin.Begin);
            await responseBuffer.CopyToAsync(originalResponseBody);

            // Try to parse JSON if content type is application/json
            object parsedBody = responseBody;
            if (context.Response.ContentType?.Contains("application/json") == true)
            {
                try
                {
                    parsedBody = JsonSerializer.Deserialize<JsonElement>(responseBody);
                }
                catch
                {
                    // Leave as string if parsing fails
                }
            }

            return new
            {
                StatusCode = context.Response.StatusCode,
                Headers = context.Response.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
                Body = parsedBody
            };
        }

        private async Task WriteLogEntry(object logEntry)
        {
            string logContent = JsonSerializer.Serialize(logEntry, _jsonOptions) + Environment.NewLine;
            string logFilePath = $"Logs/{DateTime.UtcNow:dd-MM-yyyy}.log";

            Directory.CreateDirectory("Logs");
            await File.AppendAllTextAsync(logFilePath, logContent);
        }
    }

    public static class LoggingMiddlewareExtensions
    {
        public static IApplicationBuilder UseLoggingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<LoggingMiddleware>();
        }
    }
}