using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TIS_ESPC_FORK.Models.DTOs.Agregates.Dryers
{
    public class DryerRuntime
    {
        public string TagName { get; set; }
        public string Description { get; set; }
        public string DataType { get; set; }
        public string ValueString { get; set; }
        public string RevisionTime { get; set; }
    }
}