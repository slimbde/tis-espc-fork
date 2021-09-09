using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Web;


namespace TIS_ESPC_FORK.Models.Diagnostics
{
    public class ServiceStatusProvider
    {
        static SpecificImpersonate si = new SpecificImpersonate();

        // credentials to access services at MNLZ_2
        static readonly string username;
        static readonly string pass;
        static readonly string domain;

        static ServiceStatusProvider()
        {
            object auth = ConfigurationManager.GetSection("dispatcherAuth");

            username = (auth as dynamic)["login"];
            pass = (auth as dynamic)["pass"];
            domain = (auth as dynamic)["domain"];
        }


        /// <summary>
        /// В таблицу TT_DAL2_L3_WATCHDOG sap пишет текущее время
        /// если запись в таблице раньше 5с чем текущее время, то оракловый серв не работает
        /// </summary>
        public static bool GetOracleStatus()
        {
            bool status = false;
            try
            {
                string stmt = @"SELECT 
                                    CASE WHEN WATCHDOG < SYSDATE - (1 / 86400 * 5) THEN 0
                                    ELSE 1 END AS SERVICESTATUS
                                FROM TT_DAL2_L3_WATCHDOG";

                string conString = ConfigurationManager.ConnectionStrings["oracle"].ConnectionString;
                using (OracleConnection db = new OracleConnection(conString))
                {
                    var temp = db.ExecuteScalar(stmt);
                    status = (temp.ToString() == "1") ? true : false;
                }
            }
            catch (Exception ex) { HttpContext.Current.Response.Write(ex.Message); }
            return status;
        }
        public static bool GetDispatcherStatus() => checkMNLZ2Service("dcadispatcher");
        public static bool GetCastingSpeedStatus() => checkMNLZ2Service("CastingSpeedSvc");
        public static bool GetTagFlowStatus() => checkMNLZ2Service("TagFlowSvc");



        /// <summary>
        /// Используя стандартный класс ServiceController проверяет службу на рабочее состояние
        /// Использован контроллер, т.к. служба находится на другом компе в сети
        /// </summary>
        static bool checkMNLZ2Service(string svcName)
        {
            try
            {
                return (bool)si.doImpersonateJob(username, domain, pass, () =>
                {
                    var sc = new ServiceController(svcName, "10.2.19.192");
                    if (sc.Status == ServiceControllerStatus.Running) return true;
                    return false;
                });
            }
            catch (Exception) { return false; }
        }
    }
}