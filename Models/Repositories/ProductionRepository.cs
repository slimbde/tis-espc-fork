using Dapper;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Net;
using System.Threading.Tasks;
using TIS_ESPC_FORK.Models.DTOs.Production;
using TIS_ESPC_FORK.Models.Extensions;

namespace TIS_ESPC_FORK.Models.Repositories
{
    public interface IProductionRepository : IRepository<object>
    {
        Task<IEnumerable<HeatEvent>> HeatEventsFor(string heatId, string areaId);
        Task<IEnumerable<HeatVODProcess>> HeatVODProcessesFor(string heatId);
        Task<IEnumerable<HeatCCMProcess>> HeatCCMProcessesFor(string heatId);
        Task<IEnumerable<HeatCCMQuality>> HeatCCMQualityFor(string heatId);
        Task<int> StartCCM1Heat(string heatId);
        Task<int> StopCCM1Heat(string heatId, double avgSpeed, string time, double performance);
        Task<dynamic> GetSchedule(string date);
    }




    public class ProductionRepository : IProductionRepository
    {
        readonly static string conStringLFVOD = ConfigurationManager.ConnectionStrings["oracleLFVOD"].ConnectionString;
        readonly static string conStringCCM = ConfigurationManager.ConnectionStrings["oracle"].ConnectionString;

        /// <summary>
        /// The cache for schedule info to release node 15 usage<br/>
        /// key - date, value - the set of last access time and the info itself
        /// </summary>
        IDictionary<string, dynamic> ScheduleCache = new Dictionary<string, dynamic>();



        public async Task<IEnumerable<HeatEvent>> HeatEventsFor(string heatId, string areaId)
        {
            string LFVODstmt = @"SELECT 
                                  TO_CHAR(EVENT_DATE, 'HH24:MI:SS')   TIME_POINT
                                  ,TEXT
                                FROM REP_EVENTS, REPORTS
                                WHERE 
                                  REP_EVENTS.REPORT_COUNTER=REPORTS.REPORT_COUNTER
                                  AND CUSTOM_HEAT_ID = :heatId
                                  AND AREA_ID = :areaId
                                ORDER BY EVENT_DATE";

            string CCMstmt = @"SELECT 
                                  TO_CHAR(EVENT_DATE, 'HH24:MI:SS')   TIME_POINT
                                  ,TEXT
                                FROM REP_EVENTS, REPORTS
                                WHERE 
                                  REP_EVENTS.REPORT_COUNTER=REPORTS.REPORT_COUNTER
                                  AND HEAT_ID = :heatId
                                  AND AREA_ID = :areaId
                                ORDER BY EVENT_DATE";

            string conString = areaId == "1100" ? conStringCCM : conStringLFVOD;
            string stmt = areaId == "1100" ? CCMstmt : LFVODstmt;
            using (DbConnection db = new OracleConnection(conString))
                return await db.QueryAsync<HeatEvent>(stmt, new { heatId, areaId });
        }

        public async Task<IEnumerable<HeatVODProcess>> HeatVODProcessesFor(string heatId)
        {
            string stmt = @"SELECT 
                              PROCESS_STEP_ID
                              ,TO_CHAR(RS.START_DATE, 'HH24:MI:SS')                                                                                            START_TIME
                              ,TO_CHAR(RS.STOP_DATE, 'HH24:MI:SS')                                                                                             STOP_TIME
                              ,TO_CHAR(TO_DATE('01.01.1970','dd.mm.yyyy') + NUMTODSINTERVAL((RS.STOP_DATE - RS.START_DATE)*24*60*60,'SECOND'), 'HH24:MI:SS')   ALL_TIME
                              ,STOP_STEEL_TEMP
                              ,AIM_STEEL_TEMP
                              ,VACUUM_PR_MIN
                            FROM MS_MECHEL_ESPC6.REPORTS R
                            JOIN MS_MECHEL_ESPC6.REP_VOD_STEPS RS ON R.REPORT_COUNTER = RS.REPORT_COUNTER
                            WHERE R.CUSTOM_HEAT_ID = :heatId";

            using (DbConnection db = new OracleConnection(conStringLFVOD))
                return await db.QueryAsync<HeatVODProcess>(stmt, new { heatId });
        }

        public async Task<IEnumerable<HeatCCMProcess>> HeatCCMProcessesFor(string heatId)
        {
            string stmt = @"SELECT 
                              RP.PROD_COUNTER                                                                                 N_SL
                              ,CAST(AVG(CASE WHEN (VAR_CODE=7) THEN  AVG_VALUE END) AS NUMBER(5,1))                           K_AMP
                              ,CAST(AVG(CASE WHEN (VAR_CODE=6) THEN  AVG_VALUE END)AS INT)                                    K_FREQ
                              ,CAST(AVG(CASE WHEN (VAR_CODE > 106 AND VAR_CODE < 111) THEN  AVG_VALUE END)AS INT)             DT
                              ,CAST(SUM(CASE WHEN (VAR_CODE > 114 AND VAR_CODE < 133) THEN  AVG_VALUE END)AS INT)             W_ZVO
                              ,TO_CHAR(AVG(CASE WHEN (VAR_CODE=3) THEN  MIN_VALUE END),'999')||'/'||
                                TO_CHAR(AVG(CASE WHEN (VAR_CODE=3) THEN  AVG_VALUE END),'999')||'/'||
                                TO_CHAR(AVG(CASE WHEN (VAR_CODE=3) THEN  MAX_VALUE END),'999')                                K_UR
                              ,CAST(AVG(CASE WHEN (VAR_CODE=2) THEN  AVG_VALUE END)AS INT)                                    S_POZ
                              ,TO_CHAR(AVG(CASE WHEN (VAR_CODE=1) THEN  MIN_VALUE END),'99.99')||'/'||
                                TO_CHAR(AVG(CASE WHEN (VAR_CODE=1) THEN  AVG_VALUE END),'99.99')||'/'||
                                TO_CHAR(AVG(CASE WHEN (VAR_CODE=1) THEN  MAX_VALUE END),'99.99')                              V_RAZL
                              ,TO_CHAR(AVG(CASE WHEN (VAR_CODE=17) THEN  MIN_VALUE END),'9999')||'/'||
                                TO_CHAR(AVG(CASE WHEN (VAR_CODE=17) THEN  AVG_VALUE END),'9999')||'/'||
                                TO_CHAR(AVG(CASE WHEN (VAR_CODE=17) THEN  MAX_VALUE END),'9999')                              T_PK
                              ,CAST(MAX(LENGTH) AS INT)                                                                       LEN
                              ,CAST(MAX(WIDTH_TAIL) AS INT)                                                                   WID
                              ,CAST(MAX(THICKNESS) AS INT)                                                                    THICK
                              ,CAST(MAX(WEIGHT) AS INT)                                                                       WEIGHT
                            FROM REPORTS R 
                            JOIN REP_CCM_PRODUCTS RP ON R.REPORT_COUNTER = RP.REPORT_COUNTER
                            JOIN REP_CCM_PRODUCT_VARS RPV ON RP.REPORT_COUNTER = RPV.REPORT_COUNTER
                              AND RP.PROD_COUNTER = RPV.PROD_COUNTER 
                              AND HEAT_ID = :heatId
                            GROUP BY HEAT_ID, RP.PROD_COUNTER
                            ORDER BY  HEAT_ID, RP.PROD_COUNTER";

            using (DbConnection db = new OracleConnection(conStringCCM))
                return await db.QueryAsync<HeatCCMProcess>(stmt, new { heatId });
        }

        public async Task<IEnumerable<object>> ListFor(object filter)
        {
            if (filter is ProductionFilter)
            {
                ProductionFilter flt = filter as ProductionFilter;

                string conString = flt.AreaId == "600" || flt.AreaId == "800"
                    ? conStringLFVOD
                    : conStringCCM;

                using (DbConnection db = new OracleConnection(conString))
                {
                    string LFstmt = @"SELECT 
                                      MAX(TO_CHAR(R.START_DATE, 'HH24:MI:SS'))                                                                            START_POINT
                                      ,MAX((CASE WHEN R.STOP_DATE = TO_DATE('01.01.1970','DD.MM.YYYY') THEN 'ТЕКУЩ' 
                                            ELSE TO_CHAR(R.STOP_DATE, 'HH24:MI:SS') END))                                                                 STOP_POINT
                                      ,MAX(CUSTOM_HEAT_ID)                                                                                                HEAT_ID
                                      ,MIN (FINAL_STEEL_GRADE_ID)                                                                                         STEEL_GRD
                                      ,ROUND(MIN(FINAL_WGT / 1000))                                                                                       WEIGHT
                                      ,MAX(LADLE_ID)                                                                                                      LADLE_ID
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

                    string VODstmt = @"SELECT 
                                          MAX(TO_CHAR(R.START_DATE, 'HH24:MI:SS'))                                                                              START_POINT
                                          ,MAX((CASE WHEN R.STOP_DATE = TO_DATE('01.01.1970','DD.MM.YYYY') THEN 'ТЕКУЩ' 
                                                ELSE TO_CHAR(R.STOP_DATE, 'HH24:MI:SS') END))                                                                   STOP_POINT
                                          ,MAX(CUSTOM_HEAT_ID)                                                                                                  HEAT_ID
                                          ,MIN(CASE 
                                                WHEN LENGTH(FINAL_STEEL_GRADE_ID) > 10 THEN SUBSTR(FINAL_STEEL_GRADE_ID,1,INSTR(FINAL_STEEL_GRADE_ID||' ',' '))
                                                ELSE FINAL_STEEL_GRADE_ID 
                                              END)                                                                                                              STEEL_GRD
                                          ,MIN(CASE 
                                                WHEN LTRIM(SUBSTR(PRACTICE_ID,1,3))='PER' THEN 'ТЕСТ'
                                                ELSE LTRIM(SUBSTR(PRACTICE_ID,1,3)) 
                                              END)                                                                                                              PROCESS
                                          ,ROUND(MIN(FINAL_WGT/1000))                                                                                           WEIGHT
                                          ,MAX(LADLE_ID)                                                                                                        LADLE_ID
                                          ,(SELECT TEMPERATURE_VALUE       
                                            FROM MS_MECHEL_ESPC6.REP_SAMPLES 
                                            WHERE REPORT_COUNTER=R.REPORT_COUNTER AND SAMPLE_COUNTER=1)                                                         FIRST_TEMP
                                          ,MIN(FINAL_TEMP)                                                                                                      END_TEMP
                                          ,ROUND((MAX(CASE 
                                                      WHEN R.STOP_DATE=TO_DATE('01.01.1970','DD.MM.YYYY') THEN SYSDATE 
                                                      ELSE R.STOP_DATE END)
                                                - MAX(R.START_DATE))*1440
                                           )                                                                                                                    ALL_TIME 
                                          ,ROUND(SUM(PUMP_VACUUM_TIME)/60)                                                                                      CAP_TIME
                                          ,MAX(CAST(( SELECT (MAX(EVENT_DATE)-MIN(EVENT_DATE))*1440
                                                  FROM REP_EVENTS 
                                                  WHERE 
                                                    (EVENT_CODE=1001019 OR EVENT_CODE=1001020) 
                                                    AND REPORT_COUNTER=R.REPORT_COUNTER
                                                ) AS INT))                                                                                                      VAC_TIME
                                          ,SUM(OXYGEN_SUPPLIED)                                                                                                 O2
                                          ,MIN(VACUUM_PR_MIN)                                                                                                   PRESS_MIN
                                          ,SUM(CUR_AR_1)                                                                                                        AR_FURM1
                                          ,SUM(CUR_AR_2)                                                                                                        AR_FURM2
                                          ,SUM(CUR_N2_1)                                                                                                        N_FURM1
                                          ,SUM(CUR_N2_2)                                                                                                        N_FURM2
                                          ,SUM(ROUND(CUR_TIME_1/60,2))                                                                                          BLOW_FURM1
                                          ,SUM(ROUND(CUR_TIME_2/60,2))                                                                                          BLOW_FURM2
                                          ,SUM(PRESS_AVG_1)                                                                                                     PRESS_FURM1
                                          ,SUM(PRESS_AVG_2)                                                                                                     PRESS_FURM2
                                          ,SUM(ROUND(TIME_BP_1/60,2))                                                                                           BYPASS1_TIME
                                          ,SUM(ROUND(TIME_BP_2/60,2))                                                                                           BYPASS2_TIME
                                        FROM REPORTS R, REP_VOD_STEPS RS
                                        WHERE 
                                          R.REPORT_COUNTER = RS.REPORT_COUNTER
                                          AND AREA_ID = :AreaId
                                          AND R.START_DATE BETWEEN TO_DATE(:bDate, 'YYYY-MM-DD HH24:MI:SS') AND TO_DATE(:eDate, 'YYYY-MM-DD HH24:MI:SS')
                                        GROUP BY R.REPORT_COUNTER
                                        ORDER BY MAX(R.STOP_DATE)";

                    string CCMstmt = @"SELECT  
                                          TO_CHAR(A.START_DATE, 'HH24:MI:SS')                                                                                                   START_POINT
                                          ,(CASE WHEN A.STOP_DATE = TO_DATE('01.01.1970','DD.MM.YYYY') THEN 'ТЕКУЩ' 
                                                     ELSE TO_CHAR(A.STOP_DATE, 'HH24:MI:SS') END)                                                                               STOP_POINT
                                          ,A.HEAT_ID
                                          ,A.STEEL_GRADE_ID
                                          ,ROUND((TO_NUMBER((CASE WHEN STOP_DATE=TO_DATE('01.01.1970','DD.MM.YYYY') THEN SYSDATE ELSE STOP_DATE END) - START_DATE)*1440), 0)    DURATION
                                          ,(B.SEQ_HEAT_COUNTER || '(' || B.SEQ_TOTAL_HEATS || ')')                                                                              SEQ_HEAT_COUNTER
                                          ,(SELECT MAX(WIDTH||'*'||ROUND(THICKNESS)||'*'||AIM_LEN)  FROM REP_CCM_PRODUCT_ORDERS WHERE  REPORT_COUNTER = A.REPORT_COUNTER)       MEASURES
                                          ,(SELECT NVL(COUNT (*), 0) FROM REP_CCM_PRODUCTS WHERE REPORT_COUNTER = A.REPORT_COUNTER)                                             TOT_PIECES
                                          ,(SELECT NVL(SUM(TEMPERATURE_VALUE), 0) FROM REP_SAMPLES WHERE REPORT_COUNTER = A.REPORT_COUNTER AND SAMPLE_COUNTER = 1)              FIRST_TEMP
                                          ,ROUND(LADLE_OPENING_WGT/1000 )                                                                                                       START_WGT
                                          ,ROUND((SELECT NVL(SUM(WEIGHT), 0)/1000 FROM REP_CCM_PRODUCTS WHERE REPORT_COUNTER = A.REPORT_COUNTER))                               TOT_WGT
                                          ,ROUND(TUNDISH_SKULL_WGT/1000, 1)                                                                                                     YELD
                                        FROM  REPORTS A
                                        JOIN REP_CCM B ON B.REPORT_COUNTER = A.REPORT_COUNTER
                                        WHERE  
                                          A.AREA_ID = 1100 
                                          AND A.START_DATE BETWEEN TO_DATE(:bDate, 'YYYY-MM-DD HH24:MI:SS') AND TO_DATE(:eDate, 'YYYY-MM-DD HH24:MI:SS')
                                          ORDER BY A.START_DATE";

                    string stmt = flt.AreaId == "600"
                        ? LFstmt
                        : flt.AreaId == "800"
                            ? VODstmt
                            : CCMstmt;

                    Dapper.SqlMapper.Settings.CommandTimeout = 0;
                    var res = await db.QueryAsync<object>(stmt, flt);
                    return res;
                }
            }

            throw new Exception("The filter isn't a ProductionFilter instance");
        }

        public async Task<IEnumerable<HeatCCMQuality>> HeatCCMQualityFor(string heatId)
        {
            string stmt = @"SELECT
                              PROD_COUNTER
                              ,LABEL
                              ,UNIT
                              ,CAST(MIN_RANGE AS NUMBER(10,2))                        MIN_RANGE
                              ,CAST(MAX_RANGE AS NUMBER(10,2))                        MAX_RANGE
                              ,DEFECT_LEVEL_DESCR||' '||DEFECT_TYPE_DESCR             DEFECT_LEVEL_DESCR
                              ,START_POSITION
                              ,END_POSITION
                              ,CAST(MIN_VALUE AS NUMBER(10,2))                        MIN
                              ,CAST(AVG_VALUE AS NUMBER(10,2))                        AVG
                              ,CAST(MAX_VALUE AS NUMBER(10,2))                        MAX
                            FROM REP_CCM_CONFIG_VARS V
                            JOIN REP_CCM_PRODUCT_QCS Q ON V.REPORT_COUNTER = Q.REPORT_COUNTER
                              AND V.VAR_CODE = Q.VAR_CODE
                              AND V.REPORT_COUNTER = (SELECT REPORT_COUNTER FROM REPORTS WHERE HEAT_ID = :heatId)
                            ORDER BY PROD_COUNTER, Q.VAR_CODE";

            using (DbConnection db = new OracleConnection(conStringCCM))
                return await db.QueryAsync<HeatCCMQuality>(stmt, new { heatId });
        }

        public async Task<int> StartCCM1Heat(string heatId)
        {

            using (DbConnection db = new OracleConnection(conStringCCM))
            {
                string stmt = @"SELECT COUNT(*) FROM REP_CCM1_CASTING_SPEED WHERE HEAT_ID=:heatId";
                int exists = await db.ExecuteScalarAsync<int>(stmt, new { heatId });

                if (exists == 0)
                {
                    stmt = @"INSERT INTO REP_CCM1_CASTING_SPEED (REPORT_COUNTER, HEAT_ID, START_TIME)
                                VALUES (
                                    (SELECT MAX(REPORT_COUNTER)+1 FROM REP_CCM1_CASTING_SPEED)
                                    ,:heatId
                                    ,SYSDATE
                                )";

                    return await db.ExecuteAsync(stmt, new { heatId });
                }

                return 0;
            }
        }

        public async Task<int> StopCCM1Heat(string heatId, double avgSpeed, string time, double performance)
        {

            using (DbConnection db = new OracleConnection(conStringCCM))
            {
                string stmt = @"UPDATE REP_CCM1_CASTING_SPEED
                                SET
                                    RECORD_TIME = SYSDATE
                                    ,AVG_SPEED = :avgSpeed
                                    ,RUNNING_TIME = :time
                                    ,PERFORMANCE = :performance
                                WHERE HEAT_ID = :heatId";

                return await db.ExecuteAsync(stmt, new { heatId, avgSpeed, time, performance });
            }
        }

        public async Task<dynamic> GetSchedule(string date)
        {
            if (ScheduleCache.ContainsKey(date))
            {
                IDictionary<string, dynamic> cacheSet = ScheduleCache[date] as IDictionary<string, dynamic>;

                string metallurgicalDate = DateHandler.GetMetallurgicalDate().ToString("yyyy-MM-dd");
                DateTime[] range = DateHandler.GetMetallurgicalRange(metallurgicalDate);
                if (DateTime.Parse(date) < range[0]) return cacheSet["info"];

                // if date is not a former one
                DateTime lastAccess = cacheSet["lastAccess"];
                if (DateTime.Now - lastAccess < TimeSpan.FromMinutes(5))
                    return cacheSet["info"];
            }

            string url = $"http://10.2.19.215/api/schedule.php?date={date}";

            // collect staple agregates info
            WebClient client = new WebClient();
            client.Credentials = CredentialCache.DefaultNetworkCredentials;

            string response = await client.DownloadStringTaskAsync(url);

            IEnumerable<dynamic> set = JsonConvert.DeserializeObject<IEnumerable<dynamic>>(response);

            ScheduleCache[date] = new Dictionary<string, dynamic>()
            { {"lastAccess",DateTime.Now},{"info", set} };

            return set;
        }
    }
}