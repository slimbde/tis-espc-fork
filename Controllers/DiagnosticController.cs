using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using TIS_ESPC_FORK.Models.Diagnostics;
using TIS_ESPC_FORK.Models.DTOs.Operator;
using TIS_ESPC_FORK.Models.Repositories;

namespace TIS_ESPC_FORK.Controllers
{
    public class DiagnosticController : ApiController
    {
        static readonly IRepository<OperatorInfo> oRepo = new OperatorRepository();


        [HttpGet]
        [Authorize(Roles = "Администратор,Программист")]
        [Route("api/Diagnostic/GetServiceStatus")]
        public async Task<IHttpActionResult> GetServiceStatus()
        {
            try
            {
                Dictionary<string, bool> result = new Dictionary<string, bool>();

                //result["MNLZ5_sqlite"] = ServiceStatusProvider.GetSqliteStatus();
                result["MNLZ2_dcaDispatcher"] = ServiceStatusProvider.GetDispatcherStatus();
                result["MNLZ2_oracle"] = ServiceStatusProvider.GetOracleStatus();
                result["MNLZ2_castingSpeedSvc"] = ServiceStatusProvider.GetCastingSpeedStatus();
                result["MNLZ2_tagFlowSvc"] = ServiceStatusProvider.GetTagFlowStatus();
                return Ok(await Task.FromResult(result));
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        [HttpGet]
        [Authorize(Roles = "Администратор,Программист")]
        [Route("api/Diagnostic/GetServerStatus")]
        public async Task<IHttpActionResult> GetServerStatus()
        {
            try { return Ok(await Task.FromResult(HardwareMetrics.getSpreadInfo())); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }




        [HttpPost]
        [Authorize(Roles = "Администратор,Программист,Технолог")]
        [Route("api/Diagnostic/ReadOperatorActionsAsync")]
        public async Task<IHttpActionResult> ReadOperatorActionsAsync()
        {
            try
            {
                OperatorFilter filter = JsonConvert.DeserializeObject<OperatorFilter>(Request.Content.ReadAsStringAsync().Result);
                return Ok(await oRepo.ListFor(filter));
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
