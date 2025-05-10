using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace WSB_Happy_Leash_project.Data.Models
{
        public class PetTag
        {
                [Key]
                public int Id { get; set; }

                [Required]
                [ForeignKey("Pet")]
                public int PetId { get; set; }
                [JsonIgnore]
                public Pet? Pet { get; set; }

                [Required]
                [ForeignKey("Tag")]
                public int TagId { get; set; }

                [JsonIgnore]
                public Tag? Tag { get; set; }



        }
}