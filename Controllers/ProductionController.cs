using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using TIS_ESPC_FORK.Models.DTOs.Production;
using TIS_ESPC_FORK.Models.Repositories;


namespace TIS_ESPC_FORK.Controllers
{
    [Authorize(Roles = "Администратор,Программист,Технолог")]
    public class ProductionController : ApiController
    {
        static readonly IProductionRepository pRepo = new ProductionRepository();



        [HttpPost]
        [Route("api/Production/ReadForAsync")]
        public async Task<IHttpActionResult> ReadForAsync()
        {
            try
            { 
                ProductionFilter filter = JsonConvert.DeserializeObject<ProductionFilter>(Request.Content.ReadAsStringAsync().Result);
                return Ok(await pRepo.ListFor(filter));
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet]
        [Route("api/Production/GetHeatEventsAsync")]
        public async Task<IHttpActionResult> GetHeatEventsAsync(string heatId, string areaId)
        {
            try { return Ok(await pRepo.HeatEventsFor(heatId, areaId)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet]
        [Route("api/Production/GetHeatVODProcessesAsync")]
        public async Task<IHttpActionResult> GetHeatVODProcessesAsync(string heatId)
        {
            try { return Ok(await pRepo.HeatVODProcessesFor(heatId)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet]
        [Route("api/Production/GetHeatCCMProcessesAsync")]
        public async Task<IHttpActionResult> GetHeatCCMProcessesAsync(string heatId)
        {
            try { return Ok(await pRepo.HeatCCMProcessesFor(heatId)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet]
        [Route("api/Production/GetHeatCCMQualityAsync")]
        public async Task<IHttpActionResult> GetHeatCCMQualityAsync(string heatId)
        {
            try { return Ok(await pRepo.HeatCCMQualityFor(heatId)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet]
        [Route("api/Production/GetScheduleAsync")]
        public async Task<IHttpActionResult> GetScheduleAsync(string date)
        {
            try { return Ok(await pRepo.GetSchedule(date)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
