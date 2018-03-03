using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SoSemiVigelant.Core.Models
{
    public class ModelError
    {
        public string PropertyName { get; set; }
        public string ErrorMessage { get; set; }
        public ModelError() { }

        public ModelError(string propertyName, string errorMessage)
        {
            PropertyName = propertyName;
            ErrorMessage = errorMessage;
        }

        public ModelError(string errorMessage)
        {
            PropertyName = "";
            ErrorMessage = errorMessage;
        }
    }
}
