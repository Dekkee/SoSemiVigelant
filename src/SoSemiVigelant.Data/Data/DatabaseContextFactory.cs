using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace SoSemiVigelant.Data.Data
{
    public class DatabaseContextFactory : IDbContextFactory<DatabaseContext>
    {
        public static string ConnectionString { get; set; }

        public DatabaseContext Create(DbContextFactoryOptions options)
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>();
            builder.UseNpgsql(
                ConnectionString);
            return new DatabaseContext(builder.Options);
        }

        public DatabaseContext Create()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>();
            builder.UseNpgsql(
                ConnectionString);
            return new DatabaseContext(builder.Options);
        }

        public void MigrateToLatest()
        {
            var db = Create();
            db.Database.Migrate();
        }
    }
}
