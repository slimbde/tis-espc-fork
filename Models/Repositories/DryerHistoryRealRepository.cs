using Dapper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers;

namespace TIS_ESPC_FORK.Models.Repositories
{
    public class DryerHistoryRealRepository : IRepository<DryerHistoryReal>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["sqlTIS"].ConnectionString;




        public async Task<IEnumerable<DryerHistoryReal>> ListFor(object filter)
        {
            DryerHistoryRealFilter flt = filter as DryerHistoryRealFilter;

            string dryerNum = flt.AreaId[flt.AreaId.Length - 1].ToString();
            string tableName = flt.AreaId.Contains("Dryer")
                ? $"dry{dryerNum}_average"
                : $"heat{dryerNum}_average";

            string stmt = $@"SELECT
		                        CONVERT(nvarchar, RevisionTime, 23) RevisionTime
		                        ,AvgValue
	                        FROM {tableName}
	                        INNER JOIN tag_list L 
		                        ON L.ID = tag_ID
		                        AND RevisionTime BETWEEN @From AND @To
		                        AND L.TagName = @Param
                            ORDER BY RevisionTime";

            Dapper.SqlMapper.Settings.CommandTimeout = 0;
            using (DbConnection db = new SqlConnection(conString))
                return await db.QueryAsync<DryerHistoryReal>(stmt, flt);
        }
    }
}