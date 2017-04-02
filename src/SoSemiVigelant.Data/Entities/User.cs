
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace SoSemiVigelant.Data.Entities
{
    public class User
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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
