using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoSemiVigelant.Core.Extensions
{
    public static class TimeSpanExtensions
    {
        public static string ToPrettyFormat(this TimeSpan? span)
        {

            if (span == TimeSpan.Zero) return "0 minutes";

            var sb = new StringBuilder();
            if (span?.Days > 0)
                sb.AppendFormat("{0} day{1} ", span?.Days, span?.Days > 1 ? "s" : string.Empty);
            if (span?.Hours > 0)
                sb.AppendFormat("{0} hour{1} ", span?.Hours, span?.Hours > 1 ? "s" : string.Empty);
            if (span?.Minutes > 0)
                sb.AppendFormat("{0} minute{1} ", span?.Minutes, span?.Minutes > 1 ? "s" : string.Empty);
            return sb.ToString();

        }

        public static string ToPrettyFormat(this TimeSpan span)
        {
            if (span == TimeSpan.Zero) return "0 minutes";

            var sb = new StringBuilder();
            if (span.Days > 0)
                sb.AppendFormat("{0} day{1} ", span.Days, span.Days > 1 ? "s" : string.Empty);
            if (span.Hours > 0)
                sb.AppendFormat("{0} hour{1} ", span.Hours, span.Hours > 1 ? "s" : string.Empty);
            if (span.Minutes > 0)
                sb.AppendFormat("{0} minute{1} ", span.Minutes, span.Minutes > 1 ? "s" : string.Empty);
            return sb.ToString();

        }
    }
}
