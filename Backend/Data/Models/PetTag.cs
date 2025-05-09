using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WSB_Happy_Leash_project.Data.Models
{
    public class PetTag
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Pet")]
        public int PetId { get; set; }
        public Pet Pet { get; set; }

        [Required]
        [ForeignKey("Tag")]
        public int TagId { get; set; }
        public Tag Tag { get; set; }
    }
}