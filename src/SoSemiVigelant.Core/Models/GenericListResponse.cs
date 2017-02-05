using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SoSemiVigelant.Core.Models
{
    public class GenericListResponse<T> : BaseResponse<List<T>>
    {
        public int Count { get; set; }

        public GenericListResponse()
        {
        }

        public GenericListResponse(Exception e): base(e)
        {
        }

        public GenericListResponse(ModelStateDictionary state): base(state, new List<T>()) { }

        public GenericListResponse(ModelError modelError): base(modelError)
        {
        }
    }
}