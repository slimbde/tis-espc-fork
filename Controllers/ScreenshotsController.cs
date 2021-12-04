using System;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using TIS_ESPC_FORK.Models.DTOs.Overview;
using TIS_ESPC_FORK.Models.Repositories;


namespace TIS_ESPC_FORK.Controllers
{
    [RoutePrefix("api/Screenshots")]
    public class ScreenshotsController : ApiController
    {
        static readonly IRepository<CompressorSensor> cRepo = new CompressorRepository();

        /// <summary>
        /// Receive screenshot end point. Stores data to the certain file
        /// </summary>
        [HttpPost]
        [Route("publish")]
        public HttpResponseMessage publish()
        {
            try
            {
                HttpRequest httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count < 1)
                    return Request.CreateResponse(HttpStatusCode.BadRequest);

                string targetDir = HttpContext.Current.Server.MapPath("~/Overview/");
                if (!Directory.Exists(targetDir))
                {
                    Directory.CreateDirectory(targetDir);
                    EventLog.WriteEntry("Application", "Successfully created directory Overview", EventLogEntryType.Information);
                }

                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    var filePath = HttpContext.Current.Server.MapPath("~/Overview/" + postedFile.FileName);
                    postedFile.SaveAs(filePath);
                }

                return Request.CreateResponse(HttpStatusCode.Created);
            }
            catch (Exception ex)
            {
                EventLog.WriteEntry("Application", ex.Message);
                throw ex;
            }
        }


        [HttpGet]
        [Route("ReadCompressorAsync")]
        public async Task<IHttpActionResult> ReadCompressorAsync()
        {
            try { return Ok(await cRepo.ListFor(null)); }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
