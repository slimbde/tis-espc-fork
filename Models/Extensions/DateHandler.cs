using System;

namespace TIS_ESPC_FORK.Models.Extensions
{
    public class DateHandler
    {
        /// <summary>
        /// Calculates metallurgical range. yyyy-MM-dd
        /// </summary>
        public static DateTime[] GetMetallurgicalRange(string date)
        {
            DateTime point = DateTime.Parse(date);

            DateTime[] result = new DateTime[2];
            result[0] = point - TimeSpan.FromHours(4.5);
            result[1] = point + TimeSpan.FromHours(19.5);

            return result;
        }
    }
}