using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.ServiceProcess;
using System.Web;


namespace TIS_ESPC_FORK.Models.Diagnostics
{
    public enum Workstations
    {
        L2, TIS
    }


    public class ServiceStatusProvider
    {
        static SpecificImpersonate si = new SpecificImpersonate();
        static IDictionary<Workstations, dynamic> workstations = new Dictionary<Workstations, dynamic>();



        static ServiceStatusProvider()
        {
            object l2auth = ConfigurationManager.GetSection("L2Auth");

            workstations[Workstations.L2] = new
            {
                User = (l2auth as dynamic)["login"],
                Password = (l2auth as dynamic)["pass"],
                Domain = (l2auth as dynamic)["domain"],
                Ip = (l2auth as dynamic)["ip"],
            };

            object tisAuth = ConfigurationManager.GetSection("TisAuth");
            workstations[Workstations.TIS] = new
            {
                User = (tisAuth as dynamic)["login"],
                Password = (tisAuth as dynamic)["pass"],
                Domain = (tisAuth as dynamic)["domain"],
                Ip = (tisAuth as dynamic)["ip"],
            };
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


        /// <summary>
        /// Используя стандартный класс ServiceController проверяет службу на рабочее состояние
        /// Использован контроллер, т.к. служба находится на другом компе в сети
        /// </summary>
        public static bool CheckService(string svcName, Workstations ws)
        {
            try
            {
                dynamic credentials = workstations[ws];
                string user = credentials.User.ToString();
                string domain = credentials.Domain.ToString();
                string pass = credentials.Password.ToString();
                string ip = credentials.Ip.ToString();

                return (bool)si.doImpersonateJob(user, domain, pass, () =>
                {
                    var sc = new ServiceController(svcName, ip);
                    return sc.Status == ServiceControllerStatus.Running ? true : false;
                });
            }
            catch (Exception) { return false; }
        }


        public static bool CheckLocalService(string svcName)
        {
            try
            {
                var sc = new ServiceController(svcName);
                return sc.Status == ServiceControllerStatus.Running ? true : false;
            }
            catch (Exception) { return false; }
        }
    }
}