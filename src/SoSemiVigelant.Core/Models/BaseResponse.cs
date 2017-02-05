using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SoSemiVigelant.Core.Models
{
    public enum ResponseStatus
    {
        Ok, 
        Error
    }

    public class BaseResponse<T>
    {
        public T Result { get; set; }

        public ModelError[] Errors { get; set; } = {};

        public BaseResponse()
        {
            
        } 

        public BaseResponse(string errorMessage) : this(new ModelError(errorMessage))
        {
            
        }

        public BaseResponse(Exception e) : this(e.Message)
        {

        }

        public BaseResponse(T result) : this((ModelError) null,result)
        {
        }

        public BaseResponse(ModelStateDictionary state) : this(state,default(T))
        {
        }


        public BaseResponse(ModelError error, T result)
        {
            if (error != null)
            {
                Errors = new[] { error };
            }
            Result = result;
        }

        public BaseResponse(ModelStateDictionary state, T result)
        {
            Errors = state?
                .Where(x => x.Value.Errors.Count > 0)
                .Select(x => new
                {
                    PName = x.Key,
                    Errors = x.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                })
                .SelectMany(x => x.Errors, (prop, error) => new ModelError(prop.PName, error)).ToArray();
            Result = result;
        }

        public BaseResponse(ModelError error)
        {
            if (error != null)
            {
                Errors = new[] { error };
            }
        }

        public BaseResponse(string property, string message) : this(new ModelError(property,message))
        {
        }

        //public BaseResponse(InsertOperationResult<T> result)
        //{
        //    Result = result.Contract;
        //    Errors = ConvertOperationErrors(result.Errors);
        //}

        //public BaseResponse(UpdateOperationResult<T> result)
        //{
        //    Result = result.Contract;
        //    Errors = ConvertOperationErrors(result.Errors);
        //}

        //public BaseResponse(DeleteOperationResult<T> result)
        //{
        //    Result = result.Contract;
        //    Errors = ConvertOperationErrors(result.Errors);
        //}

        //public ModelError[] ConvertOperationErrors(IEnumerable<OperationResultError> errors)
        //{
        //    return errors.Select(_ => new ModelError(_.Propery, _.Message)).ToArray();
        //}
    }
}
