using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TIS_ESPC_FORK.Models.DTOs.Production
{
    public class ProductionFilter
    {
        public string bDate { get; set; }
        public string eDate { get; set; }
        public string AreaId { get; set; }
    }
}