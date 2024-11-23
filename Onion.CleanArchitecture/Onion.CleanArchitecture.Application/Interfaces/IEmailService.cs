using Onion.CleanArchitecture.Application.DTOs.Email;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(EmailRequest request);
        Task SendMailsAsync(EmailRequests request);
    }
}
