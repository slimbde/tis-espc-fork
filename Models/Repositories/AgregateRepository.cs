using Dapper;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Staple;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public class AgregateRepository : IRepository<AgregateSummary>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["mysql"].ConnectionString;
        readonly static string oraString = ConfigurationManager.ConnectionStrings["oracle"].ConnectionString;
        readonly static string oraLFVODString = ConfigurationManager.ConnectionStrings["oracleLFVOD"].ConnectionString;




        public async Task<IEnumerable<AgregateSummary>> ListFor(object filter)
        {
            string stmt = @"SELECT      
                                dc.Description              Name
                                ,ds.dev_tag                 Tag
                                ,ds.dev_value               Value
                                ,ds.dev_upd                 UpdatePoint
                            FROM dev_state ds 
                            JOIN dev_catalog dc 
                                ON ds.device = dc.device 
                                AND dc.device IN (80,73,71,72,1,2,69,70)
                                AND ds.dev_tag <> '';";

            using (DbConnection db = new MySqlConnection(conString))
                return await db.QueryAsync<AgregateSummary>(stmt);
        }


        public async Task<IDictionary<string, object>> GetCCMInstantAsync()
        {
            IDictionary<string, object> result = new Dictionary<string, object>();

            using (IDbConnection db = new OracleConnection(oraString))
            {
                string stmt = @"WITH SHIFT AS (
                                SELECT
                                CASE 
                                    WHEN NOW.HOUR = 19 AND NOW.MINUTE > 30 THEN 2
                                    WHEN NOW.HOUR > 19 THEN 2
                                    WHEN NOW.HOUR < 7 THEN 2
                                    WHEN NOW.HOUR = 7 AND NOW.MINUTE < 30 THEN 2
                                    ELSE 1
                                END                                                                         CODE
                                ,1100                                                                       AREA_ID
                                FROM (
                                SELECT
                                    TO_NUMBER(TO_CHAR(SYSDATE, 'HH24'))                                       HOUR
                                    ,TO_NUMBER(TO_CHAR(SYSDATE, 'MI'))                                        MINUTE
                                FROM DUAL
                                ) NOW
                            )
                            SELECT
                                ID.HEAT_ID                                                                    HEATID
                                ,ID.STEEL_GRADE_ID                                                            STEELGRADEID
                                ,LI.SUPERINTENDENT                                                            SHIFTRESPONSIBLE
                                ,SHIFT.CODE                                                                   SHIFTCODE
                                ,LI.TEAM_ID                                                                   TEAMID
                                ,TI.PWD_TYPE                                                                  TUNDISHSHOS
                                ,ST.MOULD_LIFE                                                                LADLEID
                                ,GS.TUND_CAR_ON_CAST                                                          TUNDISHCAR
                                ,PO.AIM_LEN                                                                   CUTID
                            FROM RTDB_INITIAL_DATA ID
                            JOIN LOGIN_INFO LI ON LI.AREA_ID = ID.AREA_ID
                            JOIN SHIFT ON SHIFT.AREA_ID = ID.AREA_ID
                            JOIN RTDB_TUNDISH_INFO TI ON TI.AREA_ID = ID.AREA_ID
                            JOIN RTDB_CCM_GENERAL_STATUSES GS ON GS.AREA_ID = ID.AREA_ID
                            JOIN REP_CCM_PRODUCT_ORDERS PO ON PO.REPORT_COUNTER = ID.REPORT_COUNTER AND PO.ORD_SEQ = 1
                            JOIN REP_CCM_STRANDS ST ON ST.REPORT_COUNTER = ID.REPORT_COUNTER";

                result["heat"] = await db.QuerySingleAsync<CCMHeatAttributes>(stmt);

                stmt = @"WITH CCM_DATA AS (
                          SELECT
                            V.VAR_ID
                            ,Q.VAR_REAL_VALUE               VALUE
                            ,1100                           AREA_ID
                          FROM RTDB_CCM_QCS_STRANDS Q
                          JOIN RTDB_CCM_VARIABLES V ON V.VAR_CODE = Q.VAR_EXP_CODE
                        )
                        SELECT
                          MI.WIDTH                                                                                SLABWIDTH
                          ,MI.THICKNESS                                                                           SLABTHICKNESS
                          ,ST.MOULD_LIFE                                                                          CRYSTSTOIK
                          ,FLOOR(OSC.VALUE)                                                                       CRYSTFREQ
                          ,FLOOR(CRYST.VALUE)                                                                     LVL
                          ,FLOOR((LOS_FW.VALUE + FIX_FW.VALUE + LFT_FW.VALUE + RGT_FW.VALUE) * 60 / 1000)         CRYSTFLOW
                          ,FLOOR(LFT_FW.VALUE * 60 / 1000)                                                        CRYSTFLEFT
                          ,FLOOR(RGT_FW.VALUE * 60 / 1000)                                                        CRYSTFRIGHT
                          ,FLOOR((T1.VALUE + T2.VALUE + T3.VALUE + T4.VALUE) / 4)                                 CRYSTTDELTA
                          ,ID.REPORT_COUNTER
                        FROM RTDB_INITIAL_DATA ID
                        -- kostyl below is intended to fix the occasion when heat is started but no current report_counter exists in REP_CCM_STRANDS table
                        JOIN REP_CCM_STRANDS ST ON ST.REPORT_COUNTER = ID.REPORT_COUNTER OR ST.REPORT_COUNTER = (SELECT MAX(REPORT_COUNTER) FROM REP_CCM_STRANDS)
                        JOIN RTDB_MOULD_INFO MI ON MI.AREA_ID = ID.AREA_ID
                        JOIN CCM_DATA CRYST ON CRYST.AREA_ID = ID.AREA_ID AND CRYST.VAR_ID = 'MOULDLEVEL'
                        JOIN CCM_DATA OSC ON OSC.AREA_ID = ID.AREA_ID AND OSC.VAR_ID = 'OSCFREQ'
                        JOIN CCM_DATA LFT_FW ON LFT_FW.AREA_ID = ID.AREA_ID AND LFT_FW.VAR_ID = 'REP_WS_H10_LFT_FW'
                        JOIN CCM_DATA RGT_FW ON RGT_FW.AREA_ID = ID.AREA_ID AND RGT_FW.VAR_ID = 'REP_WS_H10_RGT_FW'
                        JOIN CCM_DATA LOS_FW ON LOS_FW.AREA_ID = ID.AREA_ID AND LOS_FW.VAR_ID = 'REP_WS_H10_LOS_FW'
                        JOIN CCM_DATA FIX_FW ON FIX_FW.AREA_ID = ID.AREA_ID AND FIX_FW.VAR_ID = 'REP_WS_H10_FIX_FW'
                        JOIN CCM_DATA T1 ON T1.AREA_ID = ID.AREA_ID AND T1.VAR_ID = 'REP_WS_H10_RGT_DT'
                        JOIN CCM_DATA T2 ON T2.AREA_ID = ID.AREA_ID AND T2.VAR_ID = 'REP_WS_H10_LOS_DT'
                        JOIN CCM_DATA T3 ON T3.AREA_ID = ID.AREA_ID AND T3.VAR_ID = 'REP_WS_H10_LFT_DT'
                        JOIN CCM_DATA T4 ON T4.AREA_ID = ID.AREA_ID AND T4.VAR_ID = 'REP_WS_H10_FIX_DT'";

                result["cryst"] = await db.QuerySingleAsync<CCMCrystAttributes>(stmt);

                stmt = @"WITH CCM_DATA AS (
                            SELECT
                            V.VAR_ID
                            ,Q.VAR_REAL_VALUE               VALUE
                            ,1100                           AREA_ID
                            FROM RTDB_CCM_QCS_STRANDS Q
                            JOIN RTDB_CCM_VARIABLES V ON V.VAR_CODE = Q.VAR_EXP_CODE
                        )
                        SELECT
                            ROUND(CST_SPD.VALUE, 2)                                                       CASTINGSPEED
                            ,ROUND(7380 * MI.WIDTH * MI.THICKNESS * CST_SPD.VALUE  / 10E8, 2)             FLOWSPEED
                            ,FLOOR(PD.TIME_TO_END_PROC / 60)                                              LADLETIMETOEND
                            ,FLOOR(PD.TIME_TO_END_TUND / 60)                                              TUNDISHTIMETOEND
                            ,ROUND(R.LADLE_TARE_WGT / 10E2, 1)                                            LADLETAREWEIGHT
                            ,ROUND(RC.TUNDISH_AT_LADLE_OPEN_WGT / 10E2, 1)                                TUNDISHTAREWEIGHT
                            ,ROUND(R.START_WGT / 10E2, 1)                                                 HEATWEIGHT
                            ,ROUND(LDL_WGT.VALUE, 1)                                                      LADLEWEIGHT
                            ,ROUND(TUND_WGT.VALUE, 1)                                                     TUNDISHWEIGHT
                        FROM RTDB_INITIAL_DATA ID
                        JOIN CCM_DATA CST_SPD ON CST_SPD.AREA_ID = ID.AREA_ID AND CST_SPD.VAR_ID = 'CASTSPEED'
                        JOIN RTDB_MOULD_INFO MI ON MI.AREA_ID = ID.AREA_ID
                        JOIN RTDB_PROCESS_DATA PD ON PD.AREA_ID = ID.AREA_ID
                        -- two kostyls below are intended to fix the occasion when heat is started but no current report_counter exists in target table
                        JOIN REPORTS R ON R.REPORT_COUNTER = ID.REPORT_COUNTER OR R.REPORT_COUNTER = (SELECT MAX(REPORT_COUNTER) FROM REPORTS)
                        JOIN REP_CCM RC ON RC.REPORT_COUNTER = ID.REPORT_COUNTER OR RC.REPORT_COUNTER = (SELECT MAX(REPORT_COUNTER) FROM REP_CCM)
                        JOIN CCM_DATA LDL_WGT ON LDL_WGT.AREA_ID = ID.AREA_ID AND LDL_WGT.VAR_ID = 'REP_WS_LD_WT'
                        JOIN CCM_DATA TUND_WGT ON TUND_WGT.AREA_ID = ID.AREA_ID AND TUND_WGT.VAR_ID = 'TUNDISHWGT'";

                result["phys"] = await db.QuerySingleAsync<CCMPhysAttributes>(stmt);

                stmt = "SELECT TEMPERATURE_VALUE FROM RTDB_LOG_SAMPLES";

                result["samples"] = await db.QueryAsync<string>(stmt);

                stmt = @"SELECT TO_CHAR(EVENT_DATE, 'HH24:MI ') || TEXT
                        FROM (
                            SELECT EVENT_DATE, TEXT
                            FROM RTDB_EVENTS
                            ORDER BY EVENT_DATE DESC
                        ) WHERE ROWNUM < 8 ORDER BY EVENT_DATE";

                result["events"] = await db.QueryAsync<string>(stmt);
            }

            using (IDbConnection db = new MySqlConnection(conString))
            {
                string stmt = @"SELECT      
                            dc.Description              Name
                            ,ds.dev_tag                 Tag
                            ,ds.dev_value               Value
                            ,ds.dev_upd                 UpdatePoint
                        FROM dev_state ds 
                        JOIN dev_catalog dc 
                            ON ds.device = dc.device 
                            AND dc.device = 2
                            AND ds.dev_tag <> '';";

                result["mysql"] = await db.QueryAsync<AgregateSummary>(stmt);
            }

            return result;
        }


        public async Task<IDictionary<string, object>> GetAkpVodInstantAsync(string heatId, int areaId)
        {
            IDictionary<string, object> result = new Dictionary<string, object>();

            using (IDbConnection db = new OracleConnection(oraLFVODString))
            {
                object parameters = new { HEAT_ID = heatId, AREA_ID = areaId };

                string stmt = @"SELECT
                                  R.CUSTOM_HEAT_ID              HEATID
                                  ,R.STEEL_GRADE_ID             STEELGRADE
                                  ,R.LADLE_ID                   LADLEID
                                  ,ROUND(P.EST_STEEL_WGT/1000)  HEATWEIGHT
                                  ,R.STATION_CODE               STATION_CODE
                                  ,(SELECT SUM(MATERIAL_REPORTED) FROM RTDB_LOG_MATERIALS WHERE STATION_CODE = R.STATION_CODE AND MATERIAL_CLASS = 1) WIREA1
                                  ,(SELECT SUM(MATERIAL_REPORTED) FROM RTDB_LOG_MATERIALS WHERE STATION_CODE = R.STATION_CODE AND MATERIAL_CLASS = 4) METALBATCH
                                FROM REPORTS R
                                JOIN RTDB_PROCESS_DATA P ON P.STATION_CODE = R.STATION_CODE 
                                    AND R.AREA_ID = :AREA_ID 
                                    AND R.CUSTOM_HEAT_ID = :HEAT_ID";

                result["heat"] = (await db.QueryAsync<LFHeatAttributes>(stmt, parameters)).First();

                stmt = areaId == 600
                    ? @"SELECT
                            P.TOTAL_POWER_ON          HEATCURRENTTIME
                            ,P.STIRRING_PLUG1_TIME    ARGONTIME1
                            ,P.STIRRING_PLUG2_TIME    ARGONTIME2
                            ,P.TOTAL_PROCESS_TIME     HEATTIME  
                            ,P.TOTAL_ENERGY           EEHEATACTIVE
                            ,P.TOTAL_AR_CONS          ARGONFLOW
                            ,A.CURRENT_1              ARGONFLOWINST1
                            ,A.CURRENT_2              ARGONFLOWINST2
                        FROM RTDB_PLC_DATA P
                        JOIN REPORTS R ON R.CUSTOM_HEAT_ID = :HEAT_ID AND R.AREA_ID = :AREA_ID
                        JOIN RTDB_PLC_ACTUAL_DATA A ON A.STATION_CODE = R.STATION_CODE AND P.STATION_CODE = R.STATION_CODE"

                    : @"SELECT
                            P.TOTAL_PUMP_VACUUM_TIME  HEATCURRENTTIME
                            ,P.STIRRING_PLUG1_TIME    ARGONTIME1
                            ,P.STIRRING_PLUG2_TIME    ARGONTIME2
                            ,P.TOTAL_PROCESS_TIME     HEATTIME  
                            ,P.TOTAL_STEP5_VAC_TIME   EEHEATACTIVE
                            ,P.TOTAL_AR_CONS          ARGONFLOW
                            ,A.CURRENT_1              ARGONFLOWINST1
                            ,A.CURRENT_2              ARGONFLOWINST2
                        FROM RTDB_PLC_DATA P
                        JOIN REPORTS R ON R.CUSTOM_HEAT_ID = :HEAT_ID AND R.AREA_ID = :AREA_ID
                        JOIN RTDB_PLC_ACTUAL_DATA A ON A.STATION_CODE = R.STATION_CODE AND P.STATION_CODE = R.STATION_CODE";

                result["energo"] = (await db.QueryAsync<LFEnergoAttributes>(stmt, parameters)).First();

                stmt = @"SELECT * FROM (
                            SELECT TO_CHAR(EVENT_DATE, 'HH24:MI ') || TEXT
                            FROM REP_EVENTS E
                            JOIN REPORTS R ON R.CUSTOM_HEAT_ID = :HEAT_ID
                                AND R.AREA_ID = :AREA_ID
                                AND E.REPORT_COUNTER = R.REPORT_COUNTER
                                AND E.EVENT_CLASS < 2000
                            ORDER BY EVENT_COUNTER DESC
                        )
                        WHERE ROWNUM < 7";

                result["events"] = await db.QueryAsync<string>(stmt, parameters);

                stmt = @"SELECT
                            TO_CHAR(L.SAMPLE_DATE, 'HH24:MI') POINT
                            ,L.TEMPERATURE_VALUE              VALUE
                        FROM RTDB_LOG_SAMPLES L
                        JOIN REPORTS R ON R.CUSTOM_HEAT_ID = :HEAT_ID
                          AND R.AREA_ID = :AREA_ID
                          AND L.STATION_CODE = R.STATION_CODE
                        ORDER BY SAMPLE_DATE DESC";

                string[] samples = (await db.QueryAsync<Temperature>(stmt, parameters)).Select(t => $"{t.Point}={t.Value}").ToArray();
                result["samples"] = string.Join(";", samples);

                stmt = @"SELECT
                          A.SAMPLE_ID                                       SAMPLEID
                          ,A.ANALYSIS_DATE                                  POINT
                          ,E.ELEMENT_NAME                                   ELEMENT
                          ,CASE WHEN E.VALUE < 0 THEN 0 ELSE E.VALUE END    VALUE
                        FROM REP_ELEMENTS E
                        JOIN REPORTS R ON R.REPORT_COUNTER = E.REPORT_COUNTER 
                          AND R.AREA_ID = :AREA_ID
                          AND R.CUSTOM_HEAT_ID = :HEAT_ID
                          AND MOD(E.ELEMENT_SEQ,100) IN (0,1,2,3,4,5,6,7,8,9,10,17,18,23)
                        JOIN REP_ANALYSIS A ON A.REPORT_COUNTER = R.REPORT_COUNTER 
                            AND A.ANALYSIS_COUNTER = E.ANALYSIS_COUNTER 
                            AND A.SAMPLE_ID != 'ESTIMATED'
                        ORDER BY E.ANALYSIS_COUNTER, E.ELEMENT_SEQ";

                result["chems"] = await db.QueryAsync<Chemistry>(stmt, parameters);
            }

            using (IDbConnection db = new MySqlConnection(conString))
            {
                string stmt = @"SELECT      
                                    dc.Description              Name
                                    ,ds.dev_tag                 Tag
                                    ,ds.dev_value               Value
                                    ,ds.dev_upd                 UpdatePoint
                                FROM dev_state ds 
                                JOIN dev_catalog dc 
                                    ON ds.device = dc.device 
                                    AND dc.device = @device
                                    AND ds.dev_tag <> '';";

                int device1 = areaId == 600 ? 71 : 69;
                int device2 = areaId == 600 ? 72 : 70;

                IEnumerable<AgregateSummary> tank1 = await db.QueryAsync<AgregateSummary>(stmt, new { device = device1 });

                result["mysql"] = tank1.Count(row => row.Tag == "HEAT_ID" && row.Value == heatId) != 0
                    ? tank1
                    : await db.QueryAsync<AgregateSummary>(stmt, new { device = device2 });
            }

            return result;
        }


        public static async Task UpdateHeatEndTimeAsync()
        {
            try
            {
                // get mysql heat for agregates 2,69,70,71,72,73
                string stmt = @"SELECT      
                                    dc.description              Name
                                    ,ds.dev_tag                 Tag
                                    ,ds.dev_value               Value
                                    ,ds.dev_upd                 UpdatePoint
                                FROM dev_state ds 
                                JOIN dev_catalog dc 
                                    ON ds.device = dc.device 
                                    AND dc.device IN (2,69,70,71,72,73)
                                    AND ds.dev_tag = 'HEAT_ID';";

                IEnumerable<AgregateSummary> summary;
                using (DbConnection db = new MySqlConnection(conString))
                    summary = await db.QueryAsync<AgregateSummary>(stmt);

                string ccm = summary.First(s => s.Name == "CCM-2").Value;
                string vd1 = summary.First(s => s.Name == "VD-21").Value;
                string vd2 = summary.First(s => s.Name == "VD-22").Value;
                string akp1 = summary.First(s => s.Name == "EAKP-11").Value;
                string akp2 = summary.First(s => s.Name == "EAKP-12").Value;
                string akos = summary.First(s => s.Name == "EAKP-2").Value;

                // get oracle current heat end time for LF VOD
                stmt = @"SELECT
                          DECODE(CUSTOM_HEAT_ID,:vd1,'VD-21',:vd2,'VD-22')  DEVICE
                          ,CUSTOM_HEAT_ID                                   HEAT_ID
                          ,TO_CHAR(START_DATE,'HH24:MI:SS')                 HEAT_START
                          ,CASE WHEN TO_CHAR(STOP_DATE,'YYYY')='1970' THEN NULL
                            ELSE TO_CHAR(STOP_DATE,'HH24:MI:SS')
                          END                                               HEAT_END
                        FROM REPORTS R
                        WHERE R.CUSTOM_HEAT_ID IN (:vd1,:vd2) AND AREA_ID = 800

                        UNION ALL
                        SELECT
                          DECODE(CUSTOM_HEAT_ID,:akp1,'EAKP-11',:akp2,'EAKP-12')    DEVICE
                          ,CUSTOM_HEAT_ID                                           HEAT_ID
                          ,TO_CHAR(START_DATE,'HH24:MI:SS')                         HEAT_START
                          ,CASE WHEN TO_CHAR(STOP_DATE,'YYYY')='1970' THEN NULL
                            ELSE TO_CHAR(STOP_DATE,'HH24:MI:SS')
                          END                                                       HEAT_END
                        FROM REPORTS R
                        WHERE R.CUSTOM_HEAT_ID IN (:akp1,:akp2) AND AREA_ID = 600";

                List<dynamic> endTimeToUpdate = new List<dynamic>();

                using (IDbConnection db = new OracleConnection(oraLFVODString))
                    endTimeToUpdate.AddRange(await db.QueryAsync<dynamic>(stmt, new { vd1, vd2, akp1, akp2 }));

                // get oracle current heat end time for CCM2
                stmt = @"SELECT
                          'CCM-2'                               DEVICE
                          ,HEAT_ID
                          ,TO_CHAR(START_DATE,'HH24:MI:SS')     HEAT_START
                          ,CASE WHEN TO_CHAR(STOP_DATE,'YYYY')='1970' THEN NULL
                            ELSE TO_CHAR(STOP_DATE,'HH24:MI:SS')
                          END                                   HEAT_END
                        FROM REPORTS
                        WHERE HEAT_ID = :ccm";

                using (IDbConnection db = new OracleConnection(oraString))
                    endTimeToUpdate.AddRange(await db.QueryAsync<dynamic>(stmt, new { ccm }));

                // get node23 current heat end time for DSP, AKOS
                endTimeToUpdate.AddRange(await getNode23HeatInfoAsync());

                // send heat end time back to mysql
                using (DbConnection db = new MySqlConnection(conString))
                {
                    foreach (dynamic one in endTimeToUpdate)
                    {
                        try
                        {
                            string start = (one.HEAT_START ?? "").Replace(" ", "%20");
                            string end = (one.HEAT_END ?? "").Replace(" ", "%20");

                            stmt = $"call dev_update('{one.DEVICE}~HEAT_START={start}|HEAT_END={end}|');";
                            await db.ExecuteAsync(stmt);
                        }
                        catch (Exception) { }
                    }
                }
            }
            catch (Exception ex) { Console.WriteLine(ex.Message); }
        }




        async static Task<dynamic> getNode23HeatInfoAsync()
        {
            string now = DateTime.Now.TimeOfDay > TimeSpan.FromHours(19.5) 
                ? DateTime.Now.AddDays(1).ToString("yyyyMMdd")
                : DateTime.Now.ToString("yyyyMMdd");

            string url = $"http://10.2.19.223/tis/smelt/?date={now}&agregate=akoc";

            WebClient client = new WebClient();
            client.Credentials = new NetworkCredential("admin", "321876");

            string response = await client.DownloadStringTaskAsync(url);

            IEnumerable<dynamic> set = JsonConvert
                .DeserializeObject<IEnumerable<dynamic>>(response)
                .ToLookup(one => one.AGREGATE == "AKOC" ? "EAKP-2" : "AF")
                .Select(group =>
                {
                    dynamic last = group.Last();

                    return new
                    {
                        DEVICE = group.Key,
                        HEAT_ID = last.HEAT_ID.ToString(),
                        HEAT_START = string.IsNullOrEmpty(last.START_POINT.ToString()) ? "" : last.START_POINT.ToString().Substring(11, 8),
                        HEAT_END = string.IsNullOrEmpty(last.END_POINT.ToString()) ? "" : last.END_POINT.ToString().Substring(11, 8),
                    } as dynamic;
                });

            return set;
        }
    }
}