using Dapper;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Threading.Tasks;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Staple;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public class AgregateRepository : IRepository<AgregateSummary>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["mysql"].ConnectionString;




        public async Task<IEnumerable<AgregateSummary>> ListFor(object filter)
        {
            string stmt = @"SELECT      
                                dc.Description              Name
                                ,ds.dev_tag                 Tag
                                ,ds.dev_value               Value
                                ,ds.dev_upd                 UpdatePoint
                            FROM dev_state ds 
                            JOIN dev_catalog dc 
                                ON ds.device = dc.device 
                                AND dc.device IN (80,73,71,72,1,2,69,70)
                                AND ds.dev_tag <> '';";

            using (DbConnection db = new MySqlConnection(conString))
                return await db.QueryAsync<AgregateSummary>(stmt);
        }
    }
}