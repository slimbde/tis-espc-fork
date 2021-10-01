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
    public class DryerHistoryRepository : IRepository<DryerHistory>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["sqlTIS"].ConnectionString;




        public async Task<IEnumerable<DryerHistory>> ListFor(object filter)
        {
            DryerHistoryFilter flt = filter as DryerHistoryFilter;

            string dryerNum = flt.AreaId[flt.AreaId.Length - 1].ToString();
            string tableName = flt.AreaId.Contains("Dryer")
                ? $"dry{dryerNum}_history"
                : $"heat{dryerNum}_history";


            string stmt = $@"WITH T AS (
	                            SELECT
		                            RevisionTime
		                            ,ValueString
	                            FROM {tableName}
	                            INNER JOIN tag_list L 
		                            ON L.ID = tag_ID
		                            AND RevisionTime BETWEEN @From AND @To
		                            AND L.TagName = @Param
                            )
                            SELECT
	                            CONVERT(nvarchar, RevisionTime, 23)	                RevisionTime
                                ,AVG(CAST(REPLACE(ValueString,',','.') as real))	AVGValue
                            FROM T
                            GROUP BY CONVERT(nvarchar, RevisionTime, 23)
                            ORDER BY RevisionTime";

            Dapper.SqlMapper.Settings.CommandTimeout = 0;
            using (DbConnection db = new SqlConnection(conString))
                return await db.QueryAsync<DryerHistory>(stmt, flt);
        }
    }
}