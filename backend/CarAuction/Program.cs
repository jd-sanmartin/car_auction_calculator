using CarAuction.Middleware;
using CarAuction.Services;
using CarAuction.Services.Interfaces;

namespace CarAuction;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Since this is a demo app, we will allow all origins
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowAllOrigins",
                builder =>
                {
                    builder.AllowAnyOrigin() // Allows any origin
                           .AllowAnyMethod() // Allows any HTTP method (GET, POST, PUT, etc.)
                           .AllowAnyHeader(); // Allows any header
                });
        });

        builder.Services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            options.JsonSerializerOptions.DictionaryKeyPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        });

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
        builder.Services.AddScoped<IBidService, BidService>();

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();

            app.UseCors("AllowAllOrigins");
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();


        app.MapControllers();

        app.UseMiddleware<ExceptionHandlerMiddleware>();

        app.Run();
    }
}
