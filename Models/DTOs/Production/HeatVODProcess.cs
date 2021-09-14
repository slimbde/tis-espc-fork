using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TIS_ESPC_FORK.Models.DTOs.Production
{
    public class HeatVODProcess
    {
        public string PROCESS_STEP_ID { get; set; }
        public string START_TIME { get; set; }
        public string STOP_TIME { get; set; }
        public string ALL_TIME { get; set; }
        public string STOP_STEEL_TEMP { get; set; }
        public string AIM_STEEL_TEMP { get; set; }
        public string VACUUM_PR_MIN { get; set; }
    }
}