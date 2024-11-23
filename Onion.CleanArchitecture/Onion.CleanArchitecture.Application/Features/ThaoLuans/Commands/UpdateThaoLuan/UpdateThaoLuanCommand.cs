using MediatR;
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Features.ThaoLuans.Commands.UpdateThaoLuan
{
    public class UpdateThaoLuanCommand : IRequest<Response<int>>
    {
        public int Id { get; set; }
        public string NoiDung { get; set; }
        public int? ParentId { get; set; }
        public int SoLuongPhanHoi { get; set; }

        public class UpdateThaoLuanCommandHandler : IRequestHandler<UpdateThaoLuanCommand, Response<int>>
        {
            private readonly IThaoLuanRepositoryAsync _thaoluanRepository;
            public UpdateThaoLuanCommandHandler(IThaoLuanRepositoryAsync thaoluanRepository)
            {
                _thaoluanRepository = thaoluanRepository;
            }
            public async Task<Response<int>> Handle(UpdateThaoLuanCommand command, CancellationToken cancellationToken)
            {
                var thaoluan = await _thaoluanRepository.GetByIdAsync(command.Id);

                if (thaoluan == null)
                {
                    throw new ApiException($"ThaoLuan Not Found.");
                }
                else
                {
                    thaoluan.NoiDung = command.NoiDung;
                    thaoluan.SoLuongPhanHoi = command.SoLuongPhanHoi;
                    thaoluan.ParentId = command.ParentId;
                    await _thaoluanRepository.UpdateAsync(thaoluan);
                    return new Response<int>(thaoluan.Id);
                }
            }
        }
    }
}
