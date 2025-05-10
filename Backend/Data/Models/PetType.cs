using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace WSB_Happy_Leash_project.Data.Models
{
        public class PetType
        {
                [Key]
                public int Id { get; set; }

                [Required]
                [MaxLength(50)]
                public string Name { get; set; }


                [JsonIgnore]
                public ICollection<Breed> Breeds { get; set; } = new List<Breed>();
                [JsonIgnore]
                public ICollection<Pet> Pets { get; set; } = new List<Pet>();



        }
}