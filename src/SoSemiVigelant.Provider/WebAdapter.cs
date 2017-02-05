using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using HtmlAgilityPack;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SoSemiVigelant.Provider.Entities;
using SoSemiVigelant.Provider.Utilities;

namespace SoSemiVigelant.Provider
{
    internal class WebAdapter
    {
        private CookieContainer _cookies;
        private CookieCollection _cooCol;
        private string _antiForgeryToken;
        private Stopwatch sw;

        public List<TimeSpan> TimeSpent;

        public WebAdapter()
        {
            _cookies = new CookieContainer();
            _cooCol = new CookieCollection();
            sw = new Stopwatch();
            TimeSpent = new List<TimeSpan>();
        }
        
        public string SendPost(string endpoint, object request)
        {
            try
            {
                using (var response = postRequestWithCookies(endpoint, Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(request))).Result as HttpWebResponse)
                {
                    var result = readAnswer(response);

                    if ((response as HttpWebResponse).StatusCode != HttpStatusCode.OK)
                        throw new Exception("Not ok");

                    return result;
                }
            }
            catch (WebException e)
            {
                throw new Exception("Something going wrong", e);
            }
        }

        public string SubmitForm(string endpoint, FormModel request)
        {
            try
            {
                using (var response = postRequestWithCookies(endpoint, Encoding.UTF8.GetBytes(request.GetQueryString()), "application/x-www-form-urlencoded").Result as HttpWebResponse)
                {
                    using (var dataStream = response.GetResponseStream())
                    {
                        StreamReader reader = new StreamReader(dataStream);
                        string responseFromServer = reader.ReadToEnd();

                        _antiForgeryToken = RegexUtilities.GetTokenString(
                            new Regex("antiForgeryToken = '(?<AF_Token>[^;]+)'")
                            .Match(responseFromServer), "AF_Token");
                    }

                    return "";
                }
            }
            catch (WebException e)
            {
                var response = e.Response as HttpWebResponse;
                if (response == null)
                    throw;

                return "";
            }
        }

        public string SendGet(string endpoint)
        {
            try
            {
                using (var response = getRequest(endpoint).Result)
                {
                    var result = readAnswer(response);

                    if ((response as HttpWebResponse)?.StatusCode != HttpStatusCode.OK)
                        throw new Exception("Not ok");

                    return result;
                }
            }
            catch (WebException e)
            {
                throw new Exception("Something going wrong", e);
            }
        }
        
        private async Task<WebResponse> postRequest(string endpoint, byte[] data, string contentType = "text/json")
        {
            var httpRequest = (HttpWebRequest)WebRequest.Create(new Uri(Settings.Url + endpoint));
            httpRequest.ContinueTimeout = Settings.RequestTimeOut;
            httpRequest.Method = "POST";
            httpRequest.CookieContainer = _cookies;
            httpRequest.Headers["__RequestVerificationToken"] = _antiForgeryToken;
            httpRequest.ContentType = contentType;

            //httpRequest. = data.Length;
            if (data.Length > 0)
            {
                using (var writer = await httpRequest.GetRequestStreamAsync())
                {
                    writer.Write(data, 0, data.Length);
                }
            }
            
            return await httpRequest.GetResponseAsync();
        }

        private async Task<WebResponse> getRequest(string endpoint, string contentType = "text/json")
        {
            var httpRequest = (HttpWebRequest)WebRequest.Create(new Uri(new Uri(Settings.Url), endpoint));
            httpRequest.ContinueTimeout = Settings.RequestTimeOut;
            httpRequest.Method = "GET";
            httpRequest.CookieContainer = _cookies;
            httpRequest.Headers["__RequestVerificationToken"] = _antiForgeryToken;
            httpRequest.ContentType = contentType;
            //httpRequest.ContentLength = 0;
            
            return await httpRequest.GetResponseAsync();
        }

        private async Task<WebResponse> postRequestWithCookies(string endpoint, byte[] data, string contentType = "text/json")
        {
            // Get the response.
            var response = await postRequest(endpoint, data, contentType);

            var cooks = ((HttpWebResponse) response).Cookies;
            var uri = ((HttpWebResponse)response).ResponseUri;
            _cookies.Add(uri, cooks);
            
            return response;
        }

        private async Task<HttpStatusCode> getRequestVerificationToken(string endpoint)
        {
            var request = (HttpWebRequest)WebRequest.Create(new Uri($"{Settings.Url}{endpoint}"));
            request.ContinueTimeout = Settings.RequestTimeOut;
            request.CookieContainer = _cookies;

            HttpStatusCode code;
            // Get HTML
            using (WebResponse response = await request.GetResponseAsync())
            {
                using (var dataStream = response.GetResponseStream())
                {
                    StreamReader reader = new StreamReader(dataStream);
                    string responseFromServer = reader.ReadToEnd();

                    // Get form token
                    HtmlDocument doc = new HtmlDocument();
                    doc.LoadHtml(responseFromServer);

                    // Get cookie token
                    var cooks = ((HttpWebResponse)response).Cookies;
                    var uri = ((HttpWebResponse)response).ResponseUri;
                    _cookies.Add(new Uri(Settings.Url), cooks);

                    code = (response as HttpWebResponse).StatusCode;
                }
            }

            return code;
        }

        private string readAnswer(WebResponse response)
        {
            using (var stream = response.GetResponseStream())
            {
                byte[] answer = new byte[1048576];
                int bytesRead;
                int offset = 0;
                do
                {
                    bytesRead = stream.Read(answer, offset, 1024);
                    offset += bytesRead;
                } while (bytesRead != 0);
                
                return Encoding.UTF8.GetString(answer);
            }
        }
    }
}
