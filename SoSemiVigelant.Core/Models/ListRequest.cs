using System.ComponentModel.DataAnnotations;

namespace SoSemiVigelant.Core.Models
{
    public class ListRequest
    {
        [Required]
        public int Take { get; set; } = 20;
        public int Skip { get; set; }

        /// <summary>
        /// Отлкючает Take Skip ограничения
        /// </summary>
        public bool Full { get; set; } = false;
    }
}
