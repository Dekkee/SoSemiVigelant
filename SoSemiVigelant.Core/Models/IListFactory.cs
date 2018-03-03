using System.Threading;
using System.Threading.Tasks;
using SoSemiVigelant.Data.Data;

namespace SoSemiVigelant.Core.Models
{
    public interface IListFactory<TModel, in TRequest> where TRequest : ListRequest
    {
        Task<GenericListResponse<TModel>> Create(DatabaseContext db, TRequest request, CancellationToken token);
    }
}