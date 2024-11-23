using System.Collections.Generic;

namespace Onion.CleanArchitecture.Application.Publishers
{
    public class MailPublisher
    {
        public int Type { get; set; }
        public List<string>? EmailSend { get; set; }
        public List<string>? EmailCc { get; set; }
        public string Subject { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
    }
}
