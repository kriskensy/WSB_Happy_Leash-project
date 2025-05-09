using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WSB_Happy_Leash_project.Data.Models
{
    public class HealthRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Pet")]
        public int PetId { get; set; }
        public Pet Pet { get; set; }

        [Required]
        public DateTime RecordDate { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(200)]
        public string Description { get; set; }

        [MaxLength(100)]
        public string VetName { get; set; }
    }
}