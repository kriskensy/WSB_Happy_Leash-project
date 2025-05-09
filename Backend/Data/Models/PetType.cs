using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WSB_Happy_Leash_project.Data.Models
{
    public class PetType
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public ICollection<Breed> Breeds { get; set; }
        public ICollection<Pet> Pets { get; set; }
    }
}