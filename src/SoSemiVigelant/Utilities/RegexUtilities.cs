using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace SoSemiVigelant.Utilities
{
    public static class RegexUtilities
    {
        public static List<string> GetTokenStringList(Match match, string token)
        {
            if (match.Success)
            {
                var matchList = new List<string>();

                matchList.Add(GetTokenString(match, token).Trim());

                do
                {
                    match = match.NextMatch();
                    matchList.Add(GetTokenString(match, token));
                } while (match.Success);

                return matchList;
            }
            return null;
        }

        public static string GetTokenString(Match match, string token)
        {
            if (match.Success)
            {
                try
                {
                    string returnValue = string.Empty;
                    foreach (var item in match.Groups[token].Captures)
                    {
                        returnValue += item;
                    }
                    return returnValue.Trim();
                }
                catch
                {
                    return null;
                }
            }
            return null;
        }
    }
}