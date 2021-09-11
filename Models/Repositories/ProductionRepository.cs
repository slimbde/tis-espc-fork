using Dapper;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Threading.Tasks;
using TIS_ESPC_FORK.Models.DTOs.Production;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public interface IProductionRepository : IRepository<LFHeat>
    {
        Task<IEnumerable<HeatEvent>> HeatEventsFor(string heatId, string areaId);
    }




    public class ProductionRepository : IProductionRepository
    {
        readonly static string conStringLFVOD = ConfigurationManager.ConnectionStrings["oracleLFVOD"].ConnectionString;
        readonly static string conStringCCM = ConfigurationManager.ConnectionStrings["oracle"].ConnectionString;

        public async Task<IEnumerable<HeatEvent>> HeatEventsFor(string heatId, string areaId)
        {
            string stmt = @"SELECT 
                              TO_CHAR(EVENT_DATE, 'HH24:MI:SS')   TIME_POINT
                              ,TEXT
                            FROM REP_EVENTS, REPORTS
                            WHERE 
                              REP_EVENTS.REPORT_COUNTER=REPORTS.REPORT_COUNTER
                              AND CUSTOM_HEAT_ID = :heatId
                              AND AREA_ID = :areaId
                            ORDER BY EVENT_DATE DESC";

            string conString = areaId == "1100" ? conStringCCM : conStringLFVOD;
            using (DbConnection db = new OracleConnection(conString))
                return await db.QueryAsync<HeatEvent>(stmt, new { heatId, areaId });
        }

        public async Task<IEnumerable<LFHeat>> ListFor(object filter)
        {
            if (filter is ProductionFilter)
            {
                ProductionFilter flt = filter as ProductionFilter;
                using (DbConnection db = new OracleConnection(conStringLFVOD))
                {
                    string stmt = @"SELECT 
                                      MAX(TO_CHAR(R.START_DATE, 'HH24:MI:SS'))                                                                            START_POINT
                                      ,MAX((CASE WHEN R.STOP_DATE = TO_DATE('01.01.1970','DD.MM.YYYY') THEN 'ТЕКУЩ' 
                                            ELSE TO_CHAR(R.STOP_DATE, 'HH24:MI:SS') END))                                                                 STOP_POINT
                                      ,MAX(CUSTOM_HEAT_ID)                                                                                                HEAT_ID
                                      ,MIN (FINAL_STEEL_GRADE_ID)                                                                                         STEEL_GRD
                                      ,ROUND(MIN(FINAL_WGT / 1000))                                                                                       WEIGHT
                                      ,(SELECT TEMPERATURE_VALUE FROM MS_MECHEL_ESPC6.REP_SAMPLES
                                        WHERE REPORT_COUNTER = R.REPORT_COUNTER AND SAMPLE_COUNTER = 1)                                                   FIRST_TEMP
                                      ,MIN(FINAL_TEMP)                                                                                                    END_TEMP
                                      ,TO_CHAR(
                                               TRUNC(
                                                     SUM(
                                                          (CASE 
                                                            WHEN A.STOP_DATE = TO_DATE('01.01.1970','DD.MM.YYYY') THEN SYSDATE 
                                                            ELSE A.STOP_DATE 
                                                          END) - A.START_DATE
                                                     )*24*60
                                               )
                                        ) || ':' || TO_CHAR(
                                                        MOD(
                                                            MOD(
                                                                ABS(SUM(A.STOP_DATE - A.START_DATE)*24*60*60)
                                                            , 3600)
                                                        , 60)
                                                      ,'09')                                                                                              TOTAL_TIME
                                      ,TO_CHAR(TRUNC((SUM(A.POWER_ON_TIME)/60)))|| ':' ||TO_CHAR(MOD(SUM(A.POWER_ON_TIME),60),'09')                       ENERGY_TIME
                                      ,SUM(ENERGY)                                                                                                        SUM_ENERGY
                                      ,MAX (CUR_AR_1)                                                                                                     SUM_AR1
                                      ,MAX (CUR_AR_2)                                                                                                     SUM_AR2
                                      ,MAX (CUR_N2_1)                                                                                                     SUM_N1
                                      ,MAX (CUR_N2_2)                                                                                                     SUM_N2
                                      ,TO_CHAR(TRUNC((MAX (CUR_TIME_1)/60)))|| ':' || TO_CHAR(MOD(MAX(CUR_TIME_1),60),'09')                               BLOW_TIME1
                                      ,TO_CHAR(TRUNC((MAX (CUR_TIME_2)/60)))|| ':' || TO_CHAR(MOD(MAX(CUR_TIME_2),60),'09')                               BLOW_TIME2
                                      ,ROUND(AVG(PRESS_AVG_1),2)                                                                                          PRESS_AVG1
                                      ,ROUND(AVG(PRESS_AVG_2),2)                                                                                          PRESS_AVG2
                                      ,TO_CHAR(TRUNC((MAX (TIME_BP_1)/60)))|| ':' || TO_CHAR(MOD(MAX(TIME_BP_1),60),'09')                                 BYPASS_TIME1
                                      ,TO_CHAR(TRUNC((MAX (TIME_BP_2)/60)))|| ':' || TO_CHAR(MOD(MAX(TIME_BP_2),60),'09')                                 BYPASS_TIME2
                                    FROM REPORTS R, REP_LRF_STEPS A
                                    WHERE 
                                      R.REPORT_COUNTER = A.REPORT_COUNTER
                                      AND AREA_ID = :AreaId
                                      AND R.START_DATE BETWEEN TO_DATE(:bDate, 'YYYY-MM-DD HH24:MI:SS') AND TO_DATE(:eDate, 'YYYY-MM-DD HH24:MI:SS')
                                    GROUP BY R.REPORT_COUNTER, CUSTOM_HEAT_ID, R.START_DATE
                                    ORDER BY MAX(R.START_DATE)";

                    Dapper.SqlMapper.Settings.CommandTimeout = 0;
                    var res = await db.QueryAsync<LFHeat>(stmt, flt);
                    return res;
                }
            }

            throw new Exception("The filter isn't a ProductionFilter instance");
        }
    }
}