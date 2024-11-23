using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Onion.CleanArchitecture.Application.DTOs.Email;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Application.Publishers;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Consumer.Consumer
{
    public class MailConsumer : IConsumer<MailPublisher>
    {
        private readonly ILogger<MailConsumer> _logger;
        private readonly IEmailService _EmailService;
        private readonly string _webRootPath;
        private bool isProduction = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == Environments.Production;

        public MailConsumer(IWebHostEnvironment hostingEnvironment, IEmailService EmailService, ILogger<MailConsumer> logger)
        {
            _logger = logger;
            _EmailService = EmailService;
            _webRootPath = hostingEnvironment.WebRootPath;
        }
        public async Task Consume(ConsumeContext<MailPublisher> context)
        {
            Console.WriteLine("Start send mail");
            var message = context.Message;
            _logger.LogInformation($"_webRootPath {_webRootPath}");

            string mailPath = Path.Combine(_webRootPath, @"mail/templateMail.html");
            _logger.LogInformation($"__MailPath {mailPath}");

            if (File.Exists(mailPath))
            {
                _logger.LogInformation($"Đã tìm thấy file template");
                Uri uri = new Uri(mailPath);
                string emailContent = File.ReadAllText(uri.LocalPath);

                await _EmailService.SendMailsAsync(new EmailRequests()
                {
                    Body = string.Format(emailContent, message.Content),
                    From = "'f555'<no_reply@f555.com.vn>",
                    Subject = "Subject",
                    To = message.EmailSend,
                    Cc = message.EmailCc,
                });
            }
            else
            {
                _logger.LogInformation($"Không tìm thấy file template");
            }
            _logger.LogInformation($"End send mail");

        }

    }
}
