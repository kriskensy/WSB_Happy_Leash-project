using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using System.Text.Json.Serialization;


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

                // [Required]
                // [ForeignKey("PetType")]
                // public int PetTypeId { get; set; }

                // [JsonIgnore]
                // public PetType? PetType { get; set; }

                [ForeignKey("Breed")]
                public int? BreedId { get; set; }

                [JsonIgnore]
                public Breed? Breed { get; set; }

                public string PictureURL { get; set; }

                [JsonIgnore]
                public ICollection<HealthRecord> HealthRecords { get; set; } = new List<HealthRecord>();
                [JsonIgnore]
                public ICollection<PetTag> PetTags { get; set; } = new List<PetTag>();

        }

}