using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace TIS_ESPC_FORK.Models.DTOs
{
    public class OperatorInfo
    {
        public string EventStamp { get; set; }
        public string Comment { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
    }



    public class OperatorFilter
    {
        public string From { get; set; }
        public string To { get; set; }
        public string Operation { get; set; }
        public string Comment { get; set; }
        public string EventPriority { get; set; }
        public string AreaId { get; set; }
    }
}