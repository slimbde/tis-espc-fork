using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public class DryerHistoryBoolRepository : IRepository<DryerHistoryBool>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["sqlTIS"].ConnectionString;




        public async Task<IEnumerable<DryerHistoryBool>> ListFor(object filter)
        {
            DryerHistoryBoolFilter flt = filter as DryerHistoryBoolFilter;

            string num = flt.AreaId[flt.AreaId.Length - 1].ToString();
            string procedure = flt.AreaId.Contains("Dryer")
                ? $"sp_GetDry{num}Protocol"
                : $"sp_GetHeat{num}Protocol";

            Dapper.SqlMapper.Settings.CommandTimeout = 0;
            using (DbConnection db = new SqlConnection(conString))
            {
                IEnumerable<DryerHistoryBool> result = await db.QueryAsync<DryerHistoryBool>(procedure, new { from = flt.From, to = flt.To }, commandType: CommandType.StoredProcedure);
                return result;
            }
        }
    }
}