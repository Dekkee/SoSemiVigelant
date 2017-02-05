using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoSemiVigelant.Provider.Utilities
{
    public static class Helper
    {
        public static string EscapeHtml(string fullAddress)
        {
            return fullAddress/*.Substring(fullAddress.IndexOf(Settings.Url) + Settings.Url.Length)*/.Replace("&amp;", "&");
        }
    }
}
