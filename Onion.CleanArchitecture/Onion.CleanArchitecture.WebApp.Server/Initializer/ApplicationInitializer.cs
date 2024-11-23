using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Onion.CleanArchitecture.Infrastructure.Identity.Contexts;
using Onion.CleanArchitecture.Infrastructure.Identity.Models;
using Onion.CleanArchitecture.Infrastructure.Persistence.Contexts;
using Serilog;
using Onion.CleanArchitecture.Domain.DTOs;

namespace Onion.CleanArchitecture.WebApp.Server.Initializer
{
    public class ApplicationInitializer
    {
        private readonly IServiceProvider _serviceProvider;
        private static IWebHostEnvironment _webHostEnvironment;
        private static IConfiguration _configuration;
        private bool isProduction = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == Environments.Production;
        private static string ServiceName;

        public ApplicationInitializer(IServiceProvider serviceProvider, IConfiguration configuration, IWebHostEnvironment webHostEnvironment)
        {
            _configuration = configuration;
            _serviceProvider = serviceProvider;
            _webHostEnvironment = webHostEnvironment;
            ServiceName = _configuration["ServiceName"] ?? "onion";
            if (isProduction)
            {
                ServiceName = Environment.GetEnvironmentVariable("SERVICE_NAME") ?? "onion";
            }
        }

        public async Task InitializeAsync()
        {
            //Read Configuration from appSettings
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
            //Initialize Logger
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(config)
                .CreateLogger();
            try
            {
                var identityDbContext = _serviceProvider.GetRequiredService<IdentityContext>();
                identityDbContext.Database.Migrate();
                var dbContext = _serviceProvider.GetRequiredService<ApplicationDbContext>();
                dbContext.Database.Migrate();


                var userManager = _serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
                var roleManager = _serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

                await Infrastructure.Identity.Seeds.DefaultRoles.SeedAsync(userManager, roleManager);
                await Infrastructure.Identity.Seeds.DefaultSuperAdmin.SeedAsync(userManager, roleManager);
                await Infrastructure.Identity.Seeds.DefaultBasicUser.SeedAsync(userManager, roleManager);
                Log.Information("Finished Seeding Default Data");
                Log.Information("Application Starting");
            }
            catch (Exception ex)
            {
                Log.Warning(ex, "An error occurred seeding the DB");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }
        public async Task CheckExistFilePolicy()
        {
            string filePath = Path.Combine(_webHostEnvironment.WebRootPath, "policy", ServiceName, "policy.csv");
            if (File.Exists(filePath))
            {
                Console.WriteLine("File policy exists.");
            }
            else
            {
                Console.WriteLine("File policy does not exist.");
                // Tạo thư mục cha nếu chưa tồn tại
                string directoryPath = Path.GetDirectoryName(filePath);
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                // tạo file policy.csv
                using (var writer = new StreamWriter(filePath))
                {
                    var identityDbContext = _serviceProvider.GetRequiredService<IdentityContext>();
                    var roleclaim = identityDbContext.RoleClaims;
                    var role = await identityDbContext.Roles.Where(p => roleclaim.Select(x => x.RoleId).Distinct().ToList().Contains(p.Id)).ToListAsync();
                    foreach (var policy in roleclaim)
                    {
                        var roleName = role.Where(p => p.Id == policy.RoleId).Select(p => p.Name).FirstOrDefault();
                        if (roleName != null && policy.ClaimValue != null)
                        {
                            foreach (var item in policy.ClaimValue.Split("#"))
                            {
                                writer.WriteLine($"p, {roleName}, {policy.ClaimType}, {item}");
                            }
                        }
                    }
                }
                // tạo file policy.csv
                string filePathModel = Path.Combine(_webHostEnvironment.WebRootPath, "policy", ServiceName, "model.conf");
                using (var writer = new StreamWriter(filePathModel))
                {
                    var DefaultModel = new ModelDTO().Default();
                    writer.WriteLine($"{DefaultModel}");
                }
                Console.WriteLine("File copied successfully.");
            }
        }

    }
}
