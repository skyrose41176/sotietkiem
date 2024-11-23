using MassTransit;
using Microsoft.OpenApi.Models;
using Minio;
using Onion.CleanArchitecture.Application.Consts.Rabbits;
using Onion.CleanArchitecture.Infrastructure.Shared.Environments;

namespace Onion.CleanArchitecture.WebApp.Server.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddSwaggerExtension(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.IncludeXmlComments(string.Format(@"Onion.CleanArchitecture.WebApp.Server.xml"));
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Clean Architecture - Onion.CleanArchitecture.WebApi",
                    Description = "This Api will be responsible for overall data distribution and authorization.",
                    Contact = new OpenApiContact
                    {
                        Name = "codewithmukesh",
                        Email = "hello@codewithmukesh.com",
                        Url = new Uri("https://codewithmukesh.com/contact"),
                    }
                });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    Description = "Input your Bearer token in this format - Bearer {your token here} to access this API",
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                            Scheme = "Bearer",
                            Name = "Bearer",
                            In = ParameterLocation.Header,
                        }, new List<string>()
                    },
                });
            });
        }
        public static void AddApiVersioningExtension(this IServiceCollection services)
        {
            //services.AddApiVersioningExtension(config =>
            //{
            //    // Specify the default API Version as 1.0
            //    config.DefaultApiVersion = new ApiVersion(1, 0);
            //    // If the client hasn't specified the API version in the request, use the default API version number 
            //    config.AssumeDefaultVersionWhenUnspecified = true;
            //    // Advertise the API versions supported for the particular endpoint
            //    config.ReportApiVersions = true;
            //});
        }

        public static void AddEnvironmentVariablesExtension(this IServiceCollection services)
        {
            services.AddTransient<IDatabaseSettingsProvider, DatabaseSettingsProvider>();
            services.AddTransient<IRedisSettingsProvider, RedisSettingsProvider>();
            services.AddTransient<IElasticSettingsProvider, ElasticSettingsProvider>();
            services.AddTransient<ICloudinarySettingsProvider, CloudinarySettingsProvider>();
        }
        public static void AddS3StorageExtension(this IServiceCollection services, IConfiguration config, IWebHostEnvironment env)
        {
            // var endpoint = "dc-s3.f555.com.vn:8080";
            // var accessKey = "qlvb&secretKey";
            // var secretKey = "*t8$3vbtrojans";
            var endpoint = config["S3Setting:ServiceUrl"];
            var accessKey = config["S3Setting:AccessKey"];
            var secretKey = config["S3Setting:SecretKey"];
            Console.WriteLine("S3_SERVICE_URL:" + endpoint + accessKey + secretKey);
            if (env.IsProduction())
            {
                endpoint = Environment.GetEnvironmentVariable("S3_SERVICE_URL");
                accessKey = Environment.GetEnvironmentVariable("S3_ACCESS_KEY");
                secretKey = Environment.GetEnvironmentVariable("S3_SECRET_KEY");
            }

            services.AddMinio(configureClient => configureClient
            .WithEndpoint(endpoint)
            .WithCredentials(accessKey, secretKey)
            .WithSSL(false));
        }

        public static void AddCorsPolicy(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                   builder => builder
                   .AllowAnyMethod()
                    .WithOrigins("https://vbportal.f555.com.vn")
                   .AllowAnyHeader());

            });
        }

        public static void AddRabbitMqExtension(this IServiceCollection services, IConfiguration configuration, bool isProduction)
        {
            string rabbitHost = configuration[RabbitMqAppConst.Host];
            string rabbitvHost = configuration[RabbitMqAppConst.Vhost];
            string rabbitUser = configuration[RabbitMqAppConst.User];
            string rabbitPass = configuration[RabbitMqAppConst.Pass];
            services.Configure<MassTransitHostOptions>(options =>
            {
                options.WaitUntilStarted = true;
                options.StartTimeout = TimeSpan.FromSeconds(30);
                options.StopTimeout = TimeSpan.FromMinutes(1);
            });
            if (isProduction)
            {
                rabbitHost = Environment.GetEnvironmentVariable(RabbitMqEnvConst.Host);
                rabbitvHost = Environment.GetEnvironmentVariable(RabbitMqEnvConst.Vhost);
                rabbitUser = Environment.GetEnvironmentVariable(RabbitMqEnvConst.User);
                rabbitPass = Environment.GetEnvironmentVariable(RabbitMqEnvConst.Pass);
            }
            Console.WriteLine("rabbitHost: " + rabbitHost);
            Console.WriteLine("rabbitvHost: " + rabbitvHost);
            Console.WriteLine("rabbitUser: " + rabbitUser);
            Console.WriteLine("rabbitPass: " + rabbitPass);
            Console.WriteLine($"_logs ASPNETCORE_URLS {Environment.GetEnvironmentVariable("ASPNETCORE_URLS")}");
            services.AddMassTransit(x =>
            {

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(rabbitHost, rabbitvHost, h =>
                    {
                        h.Username(rabbitUser);
                        h.Password(rabbitPass);
                    });
                });
            });
            //services.AddMassTransitHostedService();
        }
    }
}
