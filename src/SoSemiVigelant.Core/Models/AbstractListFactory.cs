using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using SoSemiVigelant.Data.Data;

namespace SoSemiVigelant.Core.Models
{
    public abstract class AbstractListFactory<TDb, TModel, TRequest> : IListFactory<TModel,TRequest> where TRequest : ListRequest
    {
        protected abstract IOrderedQueryable<TDb> BasicQuery(DatabaseContext db, TRequest request);
        protected abstract TModel Map(TDb entity);

        public async Task<GenericListResponse<TModel>> Create(DatabaseContext db, TRequest request, CancellationToken token)
        {
            IQueryable<TDb> entityList = BasicQuery(db, request);
            var count = await entityList.CountAsync(token);

            if (!request.Full)
            {
                entityList = entityList.Skip(request.Skip).Take(request.Take);
            }

            var list = (await entityList.ToArrayAsync(token)).Select(Map).ToList();
            
            return new GenericListResponse<TModel>
            {
                Result = list,
                Count = count
            };
        }

    }
}