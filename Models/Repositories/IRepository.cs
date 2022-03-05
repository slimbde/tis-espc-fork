using System.Collections.Generic;
using System.Threading.Tasks;

namespace TIS_ESPC_FORK.Models.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> ListFor(object filter);
    }
}
