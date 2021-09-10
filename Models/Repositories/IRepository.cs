using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TIS_ESPC_FORK.Models.Repositories
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> ListFor(object filter);
        Task<int> Post(T obj);
        Task<int> Put(T obj);
        Task<int> Delete(T obj);
    }
}
