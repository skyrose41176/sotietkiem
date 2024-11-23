using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using Onion.CleanArchitecture.Application.Consts.Email;
using Onion.CleanArchitecture.Application.DTOs.Email;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Domain.Settings;
using System;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Infrastructure.Shared.Services
{
    public class EmailService : IEmailService
    {
        public MailSettings _mailSettings { get; }
        public ILogger<EmailService> _logger { get; }
        private IConfiguration _config;
        private readonly IServiceProvider _service;
        private bool isProduction = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production";
        private string EmailFrom = "no_reply@f555.com.vn";
        private string SmtpHost = "mailex.f555.com.vn";
        private int SmtpPort = 587;
        private string SmtpUser = "no_reply@f555.com.vn";
        private string SmtpPass = "Ptud@VB2021";
        public EmailService(IOptions<MailSettings> mailSettings, ILogger<EmailService> logger, IServiceProvider service,
            IConfiguration config)
        {
            _mailSettings = mailSettings.Value;
            _logger = logger;
            _config = config;
            _service = service;

            EmailFrom = Environment.GetEnvironmentVariable(EmailSettingConst.EmailFrom) ?? EmailFrom;
            SmtpHost = Environment.GetEnvironmentVariable(EmailSettingConst.SmtpHost) ?? SmtpHost;
            SmtpPort = Environment.GetEnvironmentVariable(EmailSettingConst.SmtpPort) != null ? int.Parse(Environment.GetEnvironmentVariable(EmailSettingConst.SmtpPort)) : SmtpPort;
            SmtpUser = Environment.GetEnvironmentVariable(EmailSettingConst.SmtpUser) ?? SmtpUser;
            SmtpPass = Environment.GetEnvironmentVariable(EmailSettingConst.SmtpPass) ?? SmtpPass;

            _logger.LogInformation($"EmailFrom: {EmailFrom}");
            _logger.LogInformation($"SmtpHost: {SmtpHost}");
            _logger.LogInformation($"SmtpPort: {SmtpPort}");
            _logger.LogInformation($"SmtpUser: {SmtpUser}");
            _logger.LogInformation($"SmtpPass: {SmtpPass}");
        }

        public async Task SendAsync(EmailRequest request)
        {
            try
            {
                // create message
                var email = new MimeMessage();
                email.Sender = MailboxAddress.Parse(request.From ?? _mailSettings.EmailFrom);
                email.To.Add(MailboxAddress.Parse(request.To));
                email.Subject = request.Subject;
                var builder = new BodyBuilder();
                builder.HtmlBody = request.Body;
                email.Body = builder.ToMessageBody();
                using var smtp = new SmtpClient();
                smtp.Connect(_mailSettings.SmtpHost, _mailSettings.SmtpPort, SecureSocketOptions.StartTls);
                smtp.Authenticate(_mailSettings.SmtpUser, _mailSettings.SmtpPass);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);

            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex.Message, ex);
                throw new ApiException(ex.Message);
            }
        }

        public async Task SendMailsAsync(EmailRequests request)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(request.From ?? EmailFrom);
            if (request.To.Count > 0)
            {

                foreach (var item in request.To)
                {
                    try
                    {
                        email.To.Add(MailboxAddress.Parse(item));
                    }
                    catch (Exception e)
                    {
                        _logger.LogInformation("Email To: " + item + "Not found");
                        continue;
                    }
                }
            }
            if (request.Cc.Count > 0)
            {

                foreach (var item in request.Cc)
                {
                    try
                    {
                        email.Cc.Add(MailboxAddress.Parse(item));

                    }
                    catch (Exception e)
                    {
                        _logger.LogInformation("Email Cc: " + item + "Not found");
                        continue;
                    }
                }
            }
            email.Subject = request.Subject;
            var builder = new BodyBuilder();
            builder.HtmlBody = request.Body;
            email.Body = builder.ToMessageBody();
            using (var smtp = new SmtpClient())
            {
                smtp.ServerCertificateValidationCallback =
                (sender, certificate, certChainType, errors) => true;
                smtp.AuthenticationMechanisms.Remove("XOAUTH2");
                smtp.Connect(SmtpHost, SmtpPort, SecureSocketOptions.StartTls);
                smtp.Authenticate(SmtpUser, SmtpPass);
                await smtp.SendAsync(email);
                smtp.Disconnect(true);
            };
        }
    }
}
