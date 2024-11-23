
using Onion.CleanArchitecture.Application.DTOs.Email;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Interfaces
{
    public interface IEmailRepositoryAsync
    {
        Task SendMailToQueue(SendEmailRequest emailRequest);
    }
}
