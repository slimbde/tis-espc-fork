using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace TIS_ESPC_FORK.Models.DTOs.Operator
{
    public class OperatorInfo
    {
        public string EventStamp { get; set; }
        public string Comment { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
    }
}