using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Onion.CleanArchitecture.Application.Helpers;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Infrastructure.Persistence.Contexts;
using Onion.CleanArchitecture.Infrastructure.Persistence.Interceptor;
using Onion.CleanArchitecture.Infrastructure.Persistence.Repositories;
using Onion.CleanArchitecture.Infrastructure.Persistence.Repository;
using Onion.CleanArchitecture.Infrastructure.Shared.Environments;
using Onion.Infrastructure.Persistence.Repositories;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using System;

namespace Onion.CleanArchitecture.Infrastructure.Persistence
{
    public static class ServiceRegistration
    {

        public static void AddInMemoryDatabase(this IServiceCollection services)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("ApplicationDb"));
        }
        public static void AddSqlServerPersistenceInfrastructure(this IServiceCollection services, string assembly)
        {
            var sp = services.BuildServiceProvider();
            using (var scope = sp.CreateScope())
            {
                var _dbSetting = scope.ServiceProvider.GetRequiredService<IDatabaseSettingsProvider>();
                string appConnStr = _dbSetting.GetSQLServerConnectionString();
                services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
                options
                .AddInterceptors(serviceProvider.GetRequiredService<StatusUpdateInterceptor>())
                .UseSqlServer(
                appConnStr,
                b => b.MigrationsAssembly(assembly)
                ));
            }
        }

        public static void AddMySqlPersistenceInfrastructure(this IServiceCollection services, string assembly)
        {
            // Build the intermediate service provider
            var sp = services.BuildServiceProvider();
            using (var scope = sp.CreateScope())
            {
                var _dbSetting = scope.ServiceProvider.GetRequiredService<IDatabaseSettingsProvider>();
                string appConnStr = _dbSetting.GetMySQLConnectionString();
                if (!string.IsNullOrWhiteSpace(appConnStr))
                {
                    var serverVersion = new MySqlServerVersion(new Version(5, 7, 35));
                    services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
                    options
                    .AddInterceptors(serviceProvider.GetRequiredService<StatusUpdateInterceptor>())
                    .UseMySql(
                        appConnStr, serverVersion,
                        b =>
                        {
                            b.SchemaBehavior(MySqlSchemaBehavior.Ignore);
                            b.EnableRetryOnFailure(
                                maxRetryCount: 5,
                                maxRetryDelay: TimeSpan.FromSeconds(30),
                                errorNumbersToAdd: null);
                            b.MigrationsAssembly(assembly);
                            b.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                        }));
                }
            }
        }

        public static void AddNpgSqlPersistenceInfrastructure(this IServiceCollection services, string assembly)
        {
            // Build the intermediate service provider
            var sp = services.BuildServiceProvider();
            using (var scope = sp.CreateScope())
            {
                var _dbSetting = scope.ServiceProvider.GetRequiredService<IDatabaseSettingsProvider>();
                string appConnStr = _dbSetting.GetPostgresConnectionString();
                if (!string.IsNullOrWhiteSpace(appConnStr))
                {
                    services.AddDbContext<ApplicationDbContext>((options) =>
                    options.UseNpgsql(
                    appConnStr,
                    b =>
                    {
                        b.MigrationsAssembly(assembly);
                        b.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                    })

                    );
                }
            }
        }

        public static void AddPersistenceRepositories(this IServiceCollection services)
        {
            #region Repositories
            services.AddTransient(typeof(IGenericRepositoryAsync<>), typeof(GenericRepositoryAsync<>));
            services.AddTransient<IProductRepositoryAsync, ProductRepositoryAsync>();
            services.AddTransient<IEmailRepositoryAsync, EmailRepositoryAsync>();
            services.AddTransient<IPolicyRepository, PolicyRepository>();
            services.AddTransient<IThaoLuanRepositoryAsync, ThaoLuanRepositoryAsync>();
            services.AddTransient<IDinhKemRepositoryAsync, DinhKemRepositoryAsync>();

            #endregion
            #region Ldap
            services.AddTransient<ILdapAuthenHelper, LdapAuthenHelper>();
            #endregion
            #region Interceptor
            services.AddTransient<StatusUpdateInterceptor>(provider =>
            {
                var authenticatedUserService = provider.GetRequiredService<IAuthenticatedUserService>();
                return new StatusUpdateInterceptor(authenticatedUserService);
            });
            #endregion
        }
    }
}
