using System;
using System.ComponentModel.DataAnnotations;

namespace WSB_Happy_Leash_project.Data.Models
{
    public class Pet
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Range(0, 100)]
        public int Age { get; set; }

        [Range(0, 1000)]
        public double Weight { get; set; }

        public Gender Gender { get; set; }

        public string Notes { get; set; } 

        public PetType PetType { get; set; } 

        public string PictureURL { get; set; }
    }
}