using Dapper;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Web.Http;
using TIS_ESPC_FORK.Models.Repositories;


namespace TIS_ESPC_FORK.Controllers
{
    [RoutePrefix("api/Data")]
    public class DataController : ApiController
    {
        IProductionRepository pRepo = new ProductionRepository();
        string tisHistoryConString = ConfigurationManager.ConnectionStrings["sqlTisHistory"].ConnectionString;


        /// <summary>
        /// The method is used by qnx to start CCM1 heat. At the moment, the qnx handlers live at<br />//13/home/ftp/tis/SpeedCCM1.php
        /// </summary>
        [HttpGet]
        [Route("StartCCM1Heat")]
        public async Task<IHttpActionResult> StartCCM1Heat(string heatId)
        {
            try
            {
                int rowsInserted = await pRepo.StartCCM1Heat(heatId);

                if (rowsInserted > 0)
                    return Ok($"StartCCM1Heat {heatId} success");

                throw new Exception($"StartCCM1Heat: heat {heatId} exists");
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        /// <summary>
        /// The method is used by qnx to stop CCM1 heat. At the moment, the qnx handlers live at<br />//13/home/ftp/tis/SpeedCCM1.php
        /// </summary>
        [HttpGet]
        [Route("StopCCM1Heat")]
        public async Task<IHttpActionResult> StopCCM1Heat(string heatId, double avgSpeed, string time, double performance)
        {
            try
            {
                int rowsUpdated = await pRepo.StopCCM1Heat(heatId, avgSpeed, time, performance);

                if (rowsUpdated > 0)
                    return Ok($"StopCCM1Heat {heatId} success");

                throw new Exception($"StopCCM1Heat: heat {heatId} close fail");
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        /// <summary>
        /// Executes a database procedure
        /// </summary>
        /// <param name="request">e.g. sp_OpenHeat dsp,333444,C355</param>
        /// <returns>Whatever you want but single value</returns>
        [HttpGet]
        [Route("ExecTisHistory")]
        public async Task<IHttpActionResult> ExecTisHistory(string request)
        {
            try
            {
                using (IDbConnection db = new SqlConnection(tisHistoryConString))
                {
                    object reply = await db.ExecuteScalarAsync<object>($"exec {request}");
                    return Ok(reply);
                }
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }

}
