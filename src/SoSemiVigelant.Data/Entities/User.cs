
using Microsoft.EntityFrameworkCore;

namespace SoSemiVigelant.Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public int OriginId { get; set; }

        public static void Setup(ModelBuilder builder)
        {
            builder.Entity<User>()
                .HasIndex(_ => _.Name);
        }
    }
}
