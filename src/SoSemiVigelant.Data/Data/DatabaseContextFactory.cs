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
        public DatabaseContext Create(DbContextFactoryOptions options)
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>();
            builder.UseSqlServer(
                "Server=DEKKER-PC;Database=SoSemiDatabase;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new DatabaseContext(builder.Options);
        }

        public DatabaseContext Create()
        {
            var builder = new DbContextOptionsBuilder<DatabaseContext>();
            builder.UseSqlServer(
                "Server=DEKKER-PC;Database=SoSemiDatabase;Trusted_Connection=True;MultipleActiveResultSets=true");
            return new DatabaseContext(builder.Options);
        }
    }
}
