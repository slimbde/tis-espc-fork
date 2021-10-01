using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Threading.Tasks;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public class DryerRuntimeRepository : IRepository<DryerRuntime>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["sqlTIS"].ConnectionString;



        public async Task<IEnumerable<DryerRuntime>> ListFor(object filter)
        {
            DryerRuntimeFilter flt = filter as DryerRuntimeFilter;

            if (flt.AreaId.Contains("Dryer"))
            {
                string id = $"DRY{flt.AreaId[flt.AreaId.Length - 1]}_PLC";

                string stmt = @"SELECT 
                                    TagName
                                    ,Description
                                    ,DataType
                                    ,ValueString
                                    ,RevisionTime
                                FROM dry_runtime
                                WHERE TagName LIKE '%MODE_%' 
                                    AND PLC_Id = @id";

                using (DbConnection db = new SqlConnection(conString))
                    return await db.QueryAsync<DryerRuntime>(stmt, new { id });
            }
            else if (flt.AreaId.Contains("Heater"))
            {
                string id = $"HEATER{flt.AreaId[flt.AreaId.Length - 1]}_PLC";

                string stmt = @"SELECT 
                                    TagName
                                    ,Description
                                    ,DataType
                                    ,ValueString
                                    ,RevisionTime
                                FROM heater_runtime
                                WHERE TagName LIKE '%MODE_%' 
                                    AND PLC_Id = @id";

                using (DbConnection db = new SqlConnection(conString))
                    return await db.QueryAsync<DryerRuntime>(stmt, new { id });
            }
            else throw new Exception("Wrong area id");
        }
    }
}