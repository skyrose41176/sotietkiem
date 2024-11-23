using System.Text.Json.Serialization;
using Newtonsoft.Json.Serialization;
using Onion.CleanArchitecture.Application;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Infrastructure.Identity;
using Onion.CleanArchitecture.Infrastructure.Persistence;
using Onion.CleanArchitecture.Infrastructure.Shared;
using Onion.CleanArchitecture.WebApp.Server.Extensions;
using Onion.CleanArchitecture.WebApp.Server.Initializer;
using Onion.CleanArchitecture.WebApp.Server.Services;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
var builder = WebApplication.CreateBuilder(args);
var _config = builder.Configuration;
var _services = builder.Services;
var _env = builder.Environment;
// Add services to the container.

_services.AddEnvironmentVariablesExtension();
_services.AddIdentityLayer();
_services.AddApplicationLayer();
_services.AddSqlServerIdentityInfrastructure(typeof(Program).Assembly.FullName);
_services.AddIdentityRepositories(_config);
_services.AddS3StorageExtension(_config, _env);
_services.AddPersistenceRepositories();
_services.AddSqlServerPersistenceInfrastructure(typeof(Program).Assembly.FullName);
_services.AddSharedInfrastructure(_config);
_services.AddRabbitMqExtension(_config, _env.IsProduction());
_services.AddCorsPolicy();
_services.AddOpenTelemetryTracing(options =>
               options
                   .AddSource(typeof(Program).Assembly.FullName)
                    .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(typeof(Program).Assembly.FullName).AddTelemetrySdk())
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
if (_env.IsDevelopment())
{
    _services.AddSwaggerExtension();
}

_services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        options.SerializerSettings.ContractResolver = new DefaultContractResolver();
    })
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.PropertyNamingPolicy = null;
        opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });
_services.AddApiVersioningExtension();
_services.AddHealthChecks();
_services.AddScoped<IAuthenticatedUserService, AuthenticatedUserService>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
_services.AddEndpointsApiExplorer();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var webHostEnvironment = scope.ServiceProvider.GetRequiredService<IWebHostEnvironment>();
    var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
    var initializer = new ApplicationInitializer(scope.ServiceProvider, configuration, webHostEnvironment);
    await initializer.InitializeAsync();
    await initializer.CheckExistFilePolicy();
}

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
app.UseAuthorization();

app.UseErrorHandlingMiddleware();
app.UseHealthChecks("/health");
app.UseCors("CorsPolicy");
app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
