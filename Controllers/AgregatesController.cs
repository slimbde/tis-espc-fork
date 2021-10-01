using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers;
using TIS_ESPC_FORK.Models.Repositories;


namespace TIS_ESPC_FORK.Controllers
{
    [Authorize(Roles = "Администратор,Программист,Технолог")]
    public class AgregatesController : ApiController
    {
        static readonly IRepository<DryerRuntime> drRepo = new DryerRuntimeRepository();
        static readonly IRepository<DryerHistory> dhRepo = new DryerHistoryRepository();





        [HttpGet]
        [Route("api/Agregates/ReadDryerRuntimeAsync")]
        public async Task<IHttpActionResult> ReadDryerRuntimeAsync(string areaId)
        {
            try { return Ok(await drRepo.ListFor(new DryerRuntimeFilter { AreaId = areaId })); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }



        [HttpPost]
        [Route("api/Agregates/ReadDryerHistoryAsync")]
        public async Task<IHttpActionResult> ReadDryerHistoryAsync()
        {
            try
            {
                DryerHistoryFilter filter = JsonConvert.DeserializeObject<DryerHistoryFilter>(Request.Content.ReadAsStringAsync().Result);
                return Ok(await dhRepo.ListFor(filter));
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
