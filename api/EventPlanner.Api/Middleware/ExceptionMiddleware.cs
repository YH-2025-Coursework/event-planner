using System.Net;
using System.Text.Json;
using EventPlanner.Api.Exceptions;

namespace EventPlanner.Api.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            // 1. Log the error so you can see it in the console
            logger.LogError(ex, "An unexpected error occurred");
            
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var statusCode = exception switch
        {
            NotFoundException => (int)HttpStatusCode.NotFound,
            ForbiddenException => (int)HttpStatusCode.Forbidden,
            InvalidOperationException => (int)HttpStatusCode.Conflict,
            _ => (int)HttpStatusCode.InternalServerError
        };

        context.Response.StatusCode = statusCode;

        // 2. We use a simple message for the user; avoid leaking internal details for unexpected errors
        var response = new
        {
            status = statusCode,
            message = exception is NotFoundException or ForbiddenException or InvalidOperationException
                ? exception.Message
                : "An unexpected error occurred."
        };

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        return context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
    }
}