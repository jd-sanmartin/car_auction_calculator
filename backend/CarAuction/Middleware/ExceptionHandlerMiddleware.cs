using System.Net;
using System.Text.Json;

namespace CarAuction.Middleware
{
    /// <summary>
    /// Middleware to handle exceptions globally.
    /// This is done in order to centralize error handling and keeping controllers clean
    /// while at the same time, preventing showing sensitive information about our application to the user/attacker.
    /// </summary>
    /// <param name="next"></param>
    /// <param name="logger"></param>
    public class ExceptionHandlerMiddleware(RequestDelegate next, ILogger<ExceptionHandlerMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly ILogger<ExceptionHandlerMiddleware> _logger = logger;

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = new
            {
                error = new
                {
                    message = "An error occurred while processing your request."
                }
            };

            // We can return different status codes depending on the exception types
            // While these exception types are not being thrown in the current code,
            // they are included here for demonstration purposes.
            context.Response.StatusCode = exception switch
            {
                ArgumentException => (int)HttpStatusCode.BadRequest,
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                NotImplementedException => (int)HttpStatusCode.NotImplemented,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var jsonResponse = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(jsonResponse);
        }
    }
}
