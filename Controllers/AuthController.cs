using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Security;


namespace TIS_ESPC_FORK.Controllers
{
    public class AuthController : ApiController
    {
        /// <summary>
        /// The first method frontend hits to determine user role
        /// If user lacks any role the frontend won't allow user to access the app
        /// </summary>
        [HttpGet]
        [Authorize]
        [Route("api/Auth/GetUserRole")]
        public IHttpActionResult GetUserRole()
        {
            try
            {
                string[] roles = Roles.GetRolesForUser(User.Identity.Name);
                if (roles.Length > 0)
                    return Ok(roles[0]);

                throw new Exception("no such user");
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }


        #region hide
        [HttpGet]
        [Authorize]
        [Route("api/Auth/GetUserName")]
        public IHttpActionResult GetUserName() => Ok(User.Identity.Name);



        [HttpGet]
        [Authorize(Roles = "Администратор")]
        [Route("api/Auth/GetUsersForRole")]
        public IHttpActionResult GetUsersForRole(string role) => Ok(Roles.GetUsersInRole(role));



        [HttpGet]
        [Authorize(Roles = "Администратор")]
        [Route("api/Auth/AddUserToRole")]
        public IHttpActionResult AddUserToRole(string user, string role)
        {
            try
            {
                Roles.AddUserToRole(user, role);
                return Ok();
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }



        [HttpGet]
        [Authorize(Roles = "Администратор")]
        [Route("api/Auth/DeleteUser")]
        public IHttpActionResult DeleteUser(string user, string role)
        {
            try
            {
                Roles.RemoveUserFromRole(user, role);
                return Ok();
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
        #endregion

        [AllowAnonymous]
        [HttpPost]
        [Route("api/Auth/testReceive")]
        public async Task<IHttpActionResult> testReceive()
        {
            try
            {
                NameValueCollection result = await Request.Content.ReadAsFormDataAsync();
                Dictionary<string, string> receivedData = result.AllKeys.ToDictionary(key => key, key => result[key]);
                return Ok("received");
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }
    }
}
