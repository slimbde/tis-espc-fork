using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TIS_ESPC_FORK.Models.DTOs.Overview;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public class CompressorRepository : IRepository<CompressorSensor>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["sqlTIS"].ConnectionString;

        public async Task<IEnumerable<CompressorSensor>> ListFor(object filter)
        {
            string stmt = "SELECT * FROM ccm";

            using (DbConnection db = new SqlConnection(conString))
                return await db.QueryAsync<CompressorSensor>(stmt);
        }
    }
}