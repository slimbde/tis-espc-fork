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
using TIS_ESPC_FORK.Models.DTOs;

namespace TIS_ESPC_FORK.Models.Repositories
{
    public class OperatorRepository : IRepository<OperatorInfo>
    {
        readonly static Dictionary<string, string> conStrings = new Dictionary<string, string>();
        public OperatorRepository()
        {
            conStrings["CCM_DIAG"] = ConfigurationManager.ConnectionStrings["CCM_DIAG"].ConnectionString;
            conStrings["LF_DIAG"] = ConfigurationManager.ConnectionStrings["LF_DIAG"].ConnectionString;
            conStrings["VOD_DIAG"] = ConfigurationManager.ConnectionStrings["VOD_DIAG"].ConnectionString;
        }


        public Task<int> Delete(OperatorInfo obj) => throw new NotImplementedException();

        public async Task<IEnumerable<OperatorInfo>> ListFor(object filter)
        {
            if (filter is OperatorFilter)
            {
                OperatorFilter flt = filter as OperatorFilter;
                using (DbConnection db = new SqlConnection(conStrings[flt.AreaId]))
                {
                    string stmt = @"SELECT DISTINCT 
                                      [EventStamp] 
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

        public Task<int> Post(OperatorInfo obj) => throw new NotImplementedException();

        public Task<int> Put(OperatorInfo obj) => throw new NotImplementedException();
    }
}