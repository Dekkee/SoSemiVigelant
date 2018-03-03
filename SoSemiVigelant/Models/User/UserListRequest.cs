using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SoSemiVigelant.Core.Models;

namespace SoSemiVigelant.Models.User
{
    public class UserListRequest : ListRequest
    {
        /// <summary>
        /// Сортировка
        /// </summary>
        public UserListOrder? Order { get; set; }

        /// <summary>
        /// Направление сортировки
        /// </summary>
        public bool Asc { get; set; } = true;

        /// <summary>
        /// фильтр по имени
        /// </summary>
        public string Name { get; set; }
    }
}
