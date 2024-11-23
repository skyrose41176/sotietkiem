using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Onion.CleanArchitecture.Application.Interfaces.Repositories;
using Onion.CleanArchitecture.Application.Wrappers;
using MediatR;
using Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetAllThaoLuans;

namespace Onion.CleanArchitecture.Application.Features.ThaoLuans.Queries.GetAllThaoLuans
{
    public class GetAllThaoLuansQuery : IRequest<Response<object>>
    {
        public string Search { get; set; }
        public int _start { get; set; }
        public int _end { get; set; }
        public string _sort { get; set; }
        public string _order { get; set; }
        public List<string> _filter { get; set; }
    }
    public class GetAllThaoLuansQueryHandler : IRequestHandler<GetAllThaoLuansQuery, Response<object>>
    {
        private readonly IThaoLuanRepositoryAsync _thaoLuanRepository;
        private readonly IMapper _mapper;
        public GetAllThaoLuansQueryHandler(IThaoLuanRepositoryAsync thaoLuanRepository, IMapper mapper)
        {
            _thaoLuanRepository = thaoLuanRepository;
            _mapper = mapper;
        }

        public async Task<Response<object>> Handle(GetAllThaoLuansQuery request, CancellationToken cancellationToken)
        {
            var validFilter = _mapper.Map<GetAllThaoLuansParameter>(request);
            var thaoLuan = await _thaoLuanRepository.GetPagedListAsync(validFilter);
            return new Response<object>(new
            {
                thaoLuan._start,
                thaoLuan._end,
                thaoLuan._total,
                thaoLuan._hasNext,
                thaoLuan._hasPrevious,
                thaoLuan._pages,
                _data = thaoLuan
            }, message: "Success");
        }
    }
}