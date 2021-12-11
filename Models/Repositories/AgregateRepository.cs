using Dapper;
using MySql.Data.MySqlClient;
using Oracle.ManagedDataAccess.Client;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using TIS_ESPC_FORK.Models.DTOs.Agregates.Staple;


namespace TIS_ESPC_FORK.Models.Repositories
{
    public class AgregateRepository : IRepository<AgregateSummary>
    {
        readonly static string conString = ConfigurationManager.ConnectionStrings["mysql"].ConnectionString;
        readonly static string oraString = ConfigurationManager.ConnectionStrings["oracle"].ConnectionString;




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
                                ,TI.PWD_TYPE                                                                  PWDTYPE
                                ,ST.MOULD_LIFE                                                                MOULDLIFE
                                ,GS.TUND_CAR_ON_CAST                                                          TUNDISHCARONCAST
                                ,GS.LADLE_ARM_ON_CAST                                                         LADLEARMONCAST
                                ,PO.AIM_LEN                                                                   AIMLEN
                            FROM RTDB_INITIAL_DATA ID
                            JOIN LOGIN_INFO LI ON LI.AREA_ID = ID.AREA_ID
                            JOIN SHIFT ON SHIFT.AREA_ID = ID.AREA_ID
                            JOIN RTDB_TUNDISH_INFO TI ON TI.AREA_ID = ID.AREA_ID
                            JOIN RTDB_CCM_GENERAL_STATUSES GS ON GS.AREA_ID = ID.AREA_ID
                            JOIN REP_CCM_PRODUCT_ORDERS PO ON PO.REPORT_COUNTER = ID.REPORT_COUNTER AND PO.ORD_SEQ = 1
                            JOIN REP_CCM_STRANDS ST ON ST.REPORT_COUNTER = ID.REPORT_COUNTER";

            using (IDbConnection db = new OracleConnection(oraString))
            {
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
                          MI.WIDTH
                          ,MI.THICKNESS
                          ,ST.MOULD_LIFE                                                                          MOULDLIFE
                          ,FLOOR(OSC.VALUE)                                                                       FREQUENCY
                          ,FLOOR(CRYST.VALUE)                                                                     LVL
                          ,FLOOR((LOS_FW.VALUE + FIX_FW.VALUE + LFT_FW.VALUE + RGT_FW.VALUE) * 60 / 1000)         TOTALFLOW
                          ,FLOOR(LFT_FW.VALUE * 60 / 1000)                                                        LEFTFLOW
                          ,FLOOR(RGT_FW.VALUE * 60 / 1000)                                                        RIGHTFLOW
                          ,FLOOR((T1.VALUE + T2.VALUE + T3.VALUE + T4.VALUE) / 4)                                 DELTAT
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
                            ,ROUND(7380 * MI.WIDTH * MI.THICKNESS * CST_SPD.VALUE  / 10E8, 2)             STEELFLOW
                            ,FLOOR(PD.TIME_TO_END_PROC / 60)                                              LADLETIMETOEND
                            ,FLOOR(PD.TIME_TO_END_TUND / 60)                                              TUNDISHTIMETOEND
                            ,ROUND(R.LADLE_TARE_WGT / 10E2, 1)                                            LADLETAREWEIGHT
                            ,ROUND(RC.TUNDISH_AT_LADLE_OPEN_WGT / 10E2, 1)                                TUNDISHTAREWEIGHT
                            ,ROUND(R.START_WGT / 10E2, 1)                                                 PRODUCTWEIGHT
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
                stmt = @"SELECT      
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
    }
}