
using Onion.CleanArchitecture.Application.Exceptions;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using Onion.CleanArchitecture.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetThaoLuanById
{
    public class GetThaoLuanByIdQuery : IRequest<Response<ThaoLuan>>
    {
        public int Id { get; set; }
        public class GetThaoLuanByIdQueryHandler : IRequestHandler<GetThaoLuanByIdQuery, Response<ThaoLuan>>
        {
            private readonly IThaoLuanRepositoryAsync _ThaoLuanRepository;
            public GetThaoLuanByIdQueryHandler(IThaoLuanRepositoryAsync ThaoLuanRepository)
            {
                _ThaoLuanRepository = ThaoLuanRepository;
            }
            public async Task<Response<ThaoLuan>> Handle(GetThaoLuanByIdQuery query, CancellationToken cancellationToken)
            {
                var ThaoLuan = await _ThaoLuanRepository.GetByIdAsync(query.Id);
                if (ThaoLuan == null) throw new ApiException($"Không tìm thấy Thảo luận");
                return new Response<ThaoLuan>(ThaoLuan);
            }
        }
    }
}
