
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Onion.CleanArchitecture.Application.Wrappers;

namespace Onion.CleanArchitecture.Application.Features.ThaoLuans.Commands.DeleteThaoLuan
{
    public class DeleteThaoLuanByIdCommand : IRequest<Response<int>>
    {
        public int Id { get; set; }
        public class DeleteThaoLuanByIdCommandHandler : IRequestHandler<DeleteThaoLuanByIdCommand, Response<int>>
        {
            private readonly IThaoLuanRepositoryAsync _ThaoLuanRepository;
            public DeleteThaoLuanByIdCommandHandler(IThaoLuanRepositoryAsync ThaoLuanRepository)
            {
                _ThaoLuanRepository = ThaoLuanRepository;
            }
            public async Task<Response<int>> Handle(DeleteThaoLuanByIdCommand command, CancellationToken cancellationToken)
            {
                var ThaoLuan = await _ThaoLuanRepository.GetByIdAsync(command.Id);
                if (ThaoLuan == null)
                    throw new ApiException($"Thảo luận Not Found.");

                await _ThaoLuanRepository.DeleteAsync(ThaoLuan);
                return new Response<int>(ThaoLuan.Id);
            }
        }
    }
}