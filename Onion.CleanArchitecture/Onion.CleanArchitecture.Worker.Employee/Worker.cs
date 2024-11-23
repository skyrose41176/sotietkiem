using Onion.CleanArchitecture.CoreWorker.Interfaces;

namespace Onion.CleanArchitecture.Worker.Employee
{
    public class Worker : BackgroundService
    {
        private readonly ILogger<Worker> _logger;
        private readonly IServiceProvider _service;
        private readonly IHostApplicationLifetime _lifetime;
        public Worker(ILogger<Worker> logger, IServiceProvider service, IHostApplicationLifetime lifetime)
        {
            _logger = logger;
            _service = service;
            _lifetime = lifetime;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            using (var scope = _service.CreateScope())
            {
                var _employeeService = scope.ServiceProvider.GetRequiredService<IEmployeeHttpClientAsync>();
                var (add, update) = await _employeeService.SyncEmployee();
                _logger.LogInformation($"Numer of add: {add}");
                _logger.LogInformation($"Numer of update: {update}");
                _logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                _lifetime.StopApplication();
            }
        }
    }
}