

using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Onion.CleanArchitecture.Application.Consts.Rabbits;
using Onion.CleanArchitecture.Application.DTOs.Email;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Application.Publishers;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Persistence.Repositories
{

    public class EmailRepositoryAsync : IEmailRepositoryAsync
    {
        // private readonly IBus _bus;
        private IConfiguration _config;
        public ILogger<EmailRepositoryAsync> _logger;
        private bool isProduction = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == Environments.Production;
        public EmailRepositoryAsync(ILogger<EmailRepositoryAsync> logger, IConfiguration config
            // , IBus bus
            )
        {
            // _bus = bus;
            _config = config;
            _logger = logger;
        }

        public async Task SendMailToQueue(SendEmailRequest emailRequest)
        {
            string rabbitHost = _config[RabbitMqAppConst.Host];
            string rabbitvHost = _config[RabbitMqAppConst.Vhost];
            string TdvPhanBoQueue = RabbitMqAppConst.Mail;
            if (isProduction)
            {
                rabbitHost = Environment.GetEnvironmentVariable(RabbitMqEnvConst.Host);
                rabbitvHost = Environment.GetEnvironmentVariable(RabbitMqEnvConst.Vhost);
            }
            Uri uri = new Uri($"rabbitmq://{rabbitHost}/{rabbitvHost}/{TdvPhanBoQueue}");
            // var endPoint = await _bus.GetSendEndpoint(uri);
            // _logger.LogInformation("Gui queue mail");
            // _logger.LogInformation("uri: " + uri);
            // var EmailSends = new List<string>();
            // await endPoint.Send(new MailPublisher()
            // {
            //     EmailSend = emailRequest.EmailTo,
            //     EmailCc = emailRequest.EmailCc,
            //     Title = $" (Quan trọng) - KH Phản ánh/ đánh giá thấp CLDV qua kênh QRCode tại TTKD",
            //     Content = "Nội dung email"
            // });

        }
    }
}
