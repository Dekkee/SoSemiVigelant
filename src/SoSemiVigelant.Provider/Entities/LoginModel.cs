using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SoSemiVigelant.Provider.Entities
{
    public class LoginModel : FormModel
    {
        public string referer { get; set; }

        public string username { get; set; }
        
        public string password { get; set; }

        public string rememberMe { get; set; }
    }
}
