using Newtonsoft.Json;
using System;
using System.Threading.Tasks;
using System.Web.Http;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers;
using TIS_ESPC_FORK.Models.Repositories;


namespace TIS_ESPC_FORK.Controllers
{
    [RoutePrefix("api/Agregates")]
    [Authorize(Roles = "Администратор,Программист,Технолог")]
    public class AgregatesController : ApiController
    {
        static readonly IRepository<DryerRuntime> drRepo = new DryerRuntimeRepository();
        static readonly IRepository<DryerHistoryReal> dhrRepo = new DryerHistoryRealRepository();
        static readonly IRepository<DryerHistoryBool> dhbRepo = new DryerHistoryBoolRepository();
        static readonly IRepository<DryerGas> dgRepo = new DryerGasRepository();
        static readonly AgregateRepository aRepo = new AgregateRepository();





        [HttpGet]
        [Route("ReadDryerRuntimeAsync")]
        public async Task<IHttpActionResult> ReadDryerRuntimeAsync(string areaId)
        {
            try { return Ok(await drRepo.ListFor(new DryerRuntimeFilter { AreaId = areaId })); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }



        [HttpPost]
        [Route("ReadDryerHistoryRealAsync")]
        public async Task<IHttpActionResult> ReadDryerHistoryRealAsync()
        {
            try
            {
                DryerHistoryRealFilter filter = JsonConvert.DeserializeObject<DryerHistoryRealFilter>(Request.Content.ReadAsStringAsync().Result);
                return Ok(await dhrRepo.ListFor(filter));
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }



        [HttpPost]
        [Route("ReadDryerHistoryBoolAsync")]
        public async Task<IHttpActionResult> ReadDryerHistoryBoolAsync()
        {
            try
            {
                DryerHistoryBoolFilter filter = JsonConvert.DeserializeObject<DryerHistoryBoolFilter>(Request.Content.ReadAsStringAsync().Result);
                return Ok(await dhbRepo.ListFor(filter));
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }



        [HttpPost]
        [Route("ReadDryerGasHistoryAsync")]
        public async Task<IHttpActionResult> ReadDryerGasHistoryAsync()
        {
            try
            {
                DryerHistoryRealFilter filter = JsonConvert.DeserializeObject<DryerHistoryRealFilter>(Request.Content.ReadAsStringAsync().Result);
                return Ok(await dgRepo.ListFor(filter));
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }



        [HttpGet]
        [Route("ReadAgregateSummaryAsync")]
        public async Task<IHttpActionResult> ReadAgregateSummaryAsync()
        {
            try { return Ok(await aRepo.ListFor(2)); } // 2 is just a placeholder
            catch (Exception ex) { return BadRequest(ex.Message); }
        }



        [HttpGet]
        [Route("ReadAgregateInfoAsync")]
        public async Task<IHttpActionResult> ReadAgregateInfoAsync(string filter)
        {
            try
            {
                // 0-device, 1-heatId, 2-areaId
                string[] split = filter.Split(';');

                switch (split[0])
                {
                    case "ccm2": return Ok(await aRepo.GetCCMInstantAsync());
                    case "akp":
                        if (split.Length == 2) throw new Exception("not enough parameters for LfVod handling");

                        string heatId = split[1];
                        int areaId = Convert.ToInt32(split[2]);

                        return Ok(await aRepo.GetAkpVodInstantAsync(heatId, areaId));
                    default: throw new Exception("No filter provided");
                }
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
