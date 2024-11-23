

using AutoMapper;
using MediatR;
using Onion.CleanArchitecture.Application.DTOs.Email;
using Onion.CleanArchitecture.Application.Interfaces;
using Onion.CleanArchitecture.Application.Wrappers;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;


namespace Onion.CleanArchitecture.Application.Features.Emails.Commands.SendMail
{
    public class SendMailToOneEndPointCommand : IRequest<Response<bool>>
    {
        public List<string>? EmailTo { get; set; }
        public List<string>? EmailCc { get; set; }
        public string? TenTTKD { get; set; }
        public string? SDT { get; set; }
        public string? TenKhachHang { get; set; }
        public string? NoiDung { get; set; }
        public double Diem { get; set; }
        public bool? KhaoSatNguoiKhaoSatId { get; set; }

        public class SendMailToOneEndPointCommandHandler : IRequestHandler<SendMailToOneEndPointCommand, Response<bool>>
        {
            public readonly IEmailRepositoryAsync _EmailRepositoryAsync;
            private readonly IMapper _mapper;

            public SendMailToOneEndPointCommandHandler(IEmailRepositoryAsync EmailRepositoryAsync, IMapper mapper)
            {
                _EmailRepositoryAsync = EmailRepositoryAsync;
                _mapper = mapper;
            }
            public async Task<Response<bool>> Handle(SendMailToOneEndPointCommand request, CancellationToken cancellationToken)
            {
                var mailRequest = _mapper.Map<SendEmailRequest>(request);
                await _EmailRepositoryAsync.SendMailToQueue(mailRequest);

                return new Response<bool>(true);
            }
        }
    }
}
