using Dapper;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Threading.Tasks;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public class DryerGasRepository : IRepository<DryerGas>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["sqlTIS"].ConnectionString;




        public async Task<IEnumerable<DryerGas>> ListFor(object filter)
        {
            DryerHistoryRealFilter flt = filter as DryerHistoryRealFilter;

            string id = $"DRY{flt.AreaId[flt.AreaId.Length - 1]}_PLC";
            if (!flt.AreaId.Contains("Dryer"))
                id = $"HEATER{flt.AreaId[flt.AreaId.Length - 1]}_PLC";

            string tableName = $"dry_Gas_Q_{flt.Param}";

            string stmt = $@"SELECT 
	                            Data					RevisionTime
                                ,ROUND(ValueString,2)	RealValue
                            FROM {tableName}
                            WHERE 
	                            Data BETWEEN @From AND @To
	                            AND PLC_ID = @id
                            ORDER BY Data";

            using (DbConnection db = new SqlConnection(conString))
                return await db.QueryAsync<DryerGas>(stmt, new { From = flt.From, To = flt.To, id = id });
        }
    }
}