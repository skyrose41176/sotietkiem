using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Onion.CleanArchitecture.Consumer.Extensions;
using Onion.CleanArchitecture.Infrastructure.Shared;
using OpenTelemetry.Trace;
using System;

var builder = WebApplication.CreateBuilder(args);
var _services = builder.Services;
var _config = builder.Configuration;
var _env = builder.Environment;
// Add services to the container.

_services.AddEnvironmentVariablesExtension();
_services.AddSharedInfrastructure(_config);
_services.AddRabbitMqExtension(_config, _env);
_services.AddOpenTelemetryTracing(options =>
                options
                    .AddSqlClientInstrumentation(options =>
                    {
                        options.SetDbStatementForText = true;
                        options.RecordException = true;
                    })
                    .AddAspNetCoreInstrumentation(options =>
                    {
                        options.Filter = (req) => !req.Request.Path.ToUriComponent().Contains("index.html", StringComparison.OrdinalIgnoreCase)
                            && !req.Request.Path.ToUriComponent().Contains("swagger", StringComparison.OrdinalIgnoreCase);
                    })
                    .AddHttpClientInstrumentation()
                    .AddEntityFrameworkCoreInstrumentation(opt =>
                    {
                        opt.SetDbStatementForText = true;
                        opt.SetDbStatementForStoredProcedure = true;
                    })
                    .AddOtlpExporter()
                );

_services.AddControllers().AddJsonOptions(opts => opts.JsonSerializerOptions.PropertyNamingPolicy = null);

_services.AddHealthChecks();
//_services.AddScoped<IAuthenticatedUserService, AuthenticatedUserService>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
_services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (_env.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwaggerExtension();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.UseErrorHandlingMiddleware();
app.UseHealthChecks("/health");
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
//