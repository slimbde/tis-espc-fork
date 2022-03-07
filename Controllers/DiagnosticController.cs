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
    [Authorize(Roles = "Администратор,Программист,Технолог")]
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
                result["oracle"] = ServiceStatusProvider.GetOracleStatus();
                result["dcaDispatcherSvc"] = ServiceStatusProvider.CheckService("dcadispatcher", Workstations.L2);
                result["castingSpeedSvc"] = ServiceStatusProvider.CheckService("CastingSpeedSvc", Workstations.L2);
                result["plcSteelFlowSvc"] = ServiceStatusProvider.CheckService("PLC_STEEL_FLOW", Workstations.L2);
                result["sitDataPusherSvc"] = ServiceStatusProvider.CheckService("SITDataPusher", Workstations.L2);
                result["dryPlcSvc"] = ServiceStatusProvider.CheckLocalService("FromDryPLC");
                result["heaterPlcSvc"] = ServiceStatusProvider.CheckLocalService("FromHeaterPLC");
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
