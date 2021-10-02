using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers
{
    public class DryerHistoryBool
    {
        public DateTime RevisionTime { get; set; }
        public string Description { get; set; }
        public string ValueString { get; set; }
    }
}