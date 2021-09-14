using Dapper;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TIS_ESPC_FORK.Models.DTOs.Operator;

namespace TIS_ESPC_FORK.Models.Repositories
{
    public class OperatorRepository : IRepository<OperatorInfo>
    {
        readonly static Dictionary<string, string> conStrings = new Dictionary<string, string>();
        public OperatorRepository()
        {
            conStrings["CCM"] = ConfigurationManager.ConnectionStrings["sqlCCM"].ConnectionString;
            conStrings["LFVOD"] = ConfigurationManager.ConnectionStrings["sqlLFVOD"].ConnectionString;
        }


        public async Task<IEnumerable<OperatorInfo>> ListFor(object filter)
        {
            if (filter is OperatorFilter)
            {
                OperatorFilter flt = filter as OperatorFilter;
                
                string conString = flt.AreaId == "CCM_DIAG"
                    ? conStrings["CCM"]
                    : conStrings["LFVOD"];

                using (DbConnection db = new SqlConnection(conString))
                {
                    string stmt = @"SELECT DISTINCT
                                      CONVERT(varchar,[EventStamp],20) as EventStamp 
                                      ,[Comment] 
                                      ,[LimitString] as OldValue
                                      ,[ValueString] as NewValue                                
                                    FROM [WWALMDB].[dbo].[Events]
                                    WHERE 
                                      EventPriority = @EventPriority
                                      AND EventStamp BETWEEN @From AND @To 
                                      AND ValueString != 'Off'";

                    if (!string.IsNullOrEmpty(flt.Comment))
                        stmt += " AND Comment LIKE @Comment";

                    Dapper.SqlMapper.Settings.CommandTimeout = 0;
                    var res = await db.QueryAsync<OperatorInfo>(stmt, flt);
                    return res;
                }
            }

            throw new Exception("The filter isn't an OperatorFilter instance");
        }
    }
}