using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using SoSemiVigelant.Provider.Entities;

namespace SoSemiVigelant.Provider.Utilities
{
    public static class ExtensionMethods
    {
        internal static string GetQueryString(this FormModel obj)
        {
            var properties = from p in obj.GetType().GetProperties()
                             where p.GetValue(obj, null) != null
                             select p.Name + "=" + p.GetValue(obj, null);

            return string.Join("&", properties.ToArray());
        }
        
        internal static TimeSpan? ToTimeSpan(this string str)
        {
            int days = 0, hours = 0, minutes = 0, seconds = 0;
            string[] span = str.Split(' ');

            if (span.Length%2 != 0) return null;

            for (int i = 0; i < span.Length; i+=2)
            { 
                int digit = 0;
                int.TryParse(span[i], out digit);

                switch (span[i + 1].Trim())
                {
                    case "d.":
                    case "д.":
                        days = digit;
                        break;
                    case "h.":
                    case "ч.":
                        hours = digit;
                        break;
                    case "m.":
                    case "мин.":
                        minutes = digit;
                        break;
                    case "s.":
                    case "с.":
                        seconds = digit;
                        break;
                }
            }

            return new TimeSpan(days, hours, minutes, seconds);
        }
    }
}
