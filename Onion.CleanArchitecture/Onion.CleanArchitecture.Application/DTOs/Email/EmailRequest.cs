using System.Collections.Generic;

namespace Onion.CleanArchitecture.Application.DTOs.Email
{
    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string From { get; set; }
    }
    public class SendEmailRequest
    {
        public List<string> EmailTo { get; set; }
        public List<string> EmailCc { get; set; }
        public string EmailFrom { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
    public class EmailRequests
    {
        public List<string> To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public string From { get; set; }
        public List<string> Cc { get; set; }
    }
}
