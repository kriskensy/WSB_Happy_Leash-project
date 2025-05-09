using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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

        [JsonIgnore]
        public PetType? PetType { get; set; }

        [JsonIgnore]
        public ICollection<Pet> Pets { get; set; } = new List<Pet>();
    }
}