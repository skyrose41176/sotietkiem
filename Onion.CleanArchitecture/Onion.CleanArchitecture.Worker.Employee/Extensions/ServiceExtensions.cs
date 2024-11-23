
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Onion.CleanArchitecture.CoreWorker.Contexts;
using Onion.CleanArchitecture.CoreWorker.Interfaces;
using Onion.CleanArchitecture.CoreWorker.Models;

namespace Onion.CleanArchitecture.Worker.Employee.Extensions
{
    public static class ServiceExtensions
    {
        public static void AddMySQLDbContextExtension(this IServiceCollection services, IConfiguration _config, bool isProduction)
        {
            var sp = services.BuildServiceProvider();
            using (var scope = sp.CreateScope())
            {
                var _dbSetting = scope.ServiceProvider.GetRequiredService<IDatabaseSettingsProvider>();
                string appConnStr = _dbSetting.GetSQLServerConnectionString();

                var serverVersion = new MySqlServerVersion(new Version(8, 0, 27));
                Console.WriteLine(appConnStr);
                services.AddDbContext<IdentityContext>(options =>
                options.UseMySql(appConnStr, serverVersion));
                services.AddIdentityCore<ApplicationUser>().AddEntityFrameworkStores<IdentityContext>();
            }
        }
        public static void AddSQLDbContextExtension(this IServiceCollection services, IConfiguration _config, bool isProduction)
        {
            var sp = services.BuildServiceProvider();
            using (var scope = sp.CreateScope())
            {
                var _dbSetting = scope.ServiceProvider.GetRequiredService<IDatabaseSettingsProvider>();
                string appConnStr = _dbSetting.GetSQLServerConnectionString();

                Console.WriteLine(appConnStr);
                services.AddDbContext<IdentityContext>(options =>
                options.UseSqlServer(appConnStr));
                //services.AddIdentityCore<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<IdentityContext>();
                //services.AddIdentityCore<ApplicationUser>().AddEntityFrameworkStores<IdentityContext>();
                services.AddIdentity<ApplicationUser, IdentityRole>().AddEntityFrameworkStores<IdentityContext>().AddDefaultTokenProviders();
            }
        }
    }
}
