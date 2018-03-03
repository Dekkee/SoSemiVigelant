using System;

namespace SoSemiVigelant.Provider
{
    public class Settings
    {
        public static string Url = "http://topdeck.ru/";
        public static Uri BaseUri = new Uri(Url);
        public static int RequestTimeOut = 300000;
        
        internal static void LoadConfig()
        {
            
        }
    }
}
