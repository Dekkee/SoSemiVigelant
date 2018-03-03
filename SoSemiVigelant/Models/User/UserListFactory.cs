using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using SoSemiVigelant.Core.Models;
using SoSemiVigelant.Data.Data;
using SoSemiVigelant.Models.User;
using UserEntity = SoSemiVigelant.Data.Entities.User;

namespace SoSemiVigelant.Models.User
{
    public class UserListFactory : AbstractListFactory<UserEntity, UserModel, UserListRequest>
    {
        protected override IOrderedQueryable<UserEntity> BasicQuery(DatabaseContext db, UserListRequest request)
        {
            var users = db.Users.AsQueryable();

            users = Filteration(users, request);
            users = OrderBy(users, request.Order, request.Asc);

            return (IOrderedQueryable<UserEntity>)users;
        }

        /// <summary>
        /// Фильтрация
        /// </summary>
        /// <param name="users"></param>
        /// <param name="request"></param>
        /// <returns></returns>
        private IQueryable<UserEntity> Filteration(IQueryable<UserEntity> users, UserListRequest request)
        {
            users = string.IsNullOrEmpty(request.Name)
                ? users
                : users.Where(_ => _.Name.Contains(request.Name));

            return users;
        }

        /// <summary>
        /// Сортировка по <see cref="UserListOrder"/>
        /// </summary>
        /// <param name="order"></param>
        /// <param name="asc">направление</param>
        /// <param name="users"></param>
        /// <returns></returns>
        private IOrderedQueryable<UserEntity> OrderBy(IQueryable<UserEntity> users, UserListOrder? order = null, bool asc = true)
        {
            if (order == null)
            {
                // сортировка по умолчанию
                return users.OrderBy(_ => _.Name);
            }

            switch (order.Value)
            {
                case UserListOrder.Name:
                    return asc ? users.OrderBy(_ => _.Name) : users.OrderByDescending(_ => _.Name);
                default:
                    return asc ? users.OrderBy(_ => _.Id) : users.OrderByDescending(_ => _.Id);
            }
        }

        protected override UserModel Map(UserEntity entity)
        {
            return UserModel.Create(entity);
        }
    }
}
