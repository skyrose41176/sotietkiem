
using Onion.CleanArchitecture.CoreWorker.Interfaces;
using Onion.CleanArchitecture.CoreWorker.Repositories;
using Onion.CleanArchitecture.Worker.Employee;
using Onion.CleanArchitecture.Worker.Employee.Extensions;

IHost host = Host.CreateDefaultBuilder(args)
    .ConfigureServices((hostContext, services) =>
    {
        IConfiguration _config = hostContext.Configuration;
        IHostEnvironment _env = hostContext.HostingEnvironment;
        var nhanSuURI = _config["ServicesUri:NhanSu"];
        services.AddTransient<IDatabaseSettingsProvider, DatabaseSettingsProvider>();
        if (_env.IsProduction())
        {
            nhanSuURI = Environment.GetEnvironmentVariable("SERVICE_URI_NHANSU");
        }
        services.AddHttpClient<IEmployeeHttpClientAsync, EmployeeHttpClientAsync>(c =>
        {
            c.BaseAddress = new Uri(nhanSuURI);
        }).ConfigurePrimaryHttpMessageHandler(() =>
        {
            var handler = new HttpClientHandler();
            handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };

            return handler;
        });

        services.AddSQLDbContextExtension(_config, _env.IsProduction());
        services.AddHostedService<Worker>();
    })
    .Build();

host.Run();
