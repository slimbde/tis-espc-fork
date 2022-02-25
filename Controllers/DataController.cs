using System;
using System.Threading.Tasks;
using System.Web.Http;
using TIS_ESPC_FORK.Models.Repositories;


namespace TIS_ESPC_FORK.Controllers
{
    [RoutePrefix("api/Data")]
    public class DataController : ApiController
    {
        IProductionRepository pRepo = new ProductionRepository();



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
    }

}
