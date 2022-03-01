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
            DateTime point = GetMetallurgicalDate(date);

            DateTime[] result = new DateTime[2];
            result[0] = point - TimeSpan.FromHours(4.5);
            result[1] = point + TimeSpan.FromHours(19.5);

            return result;
        }

        /// <summary>
        /// Calculates metallurgical date. yyyy-MM-dd
        /// </summary>
        public static DateTime GetMetallurgicalDate(string date)
        {
            DateTime point = DateTime.Parse(date);
            if (DateTime.Now.TimeOfDay > TimeSpan.FromHours(19.5))
                return DateTime.Now.AddDays(1).Date;

            return point.Date;
        }
    }
}