using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WSB_Happy_Leash_project.Data.Models
{
    public class Breed
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [ForeignKey("PetType")]
        public int PetTypeId { get; set; }
        public PetType PetType { get; set; }

        public ICollection<Pet> Pets { get; set; }
    }
}