using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WSB_Happy_Leash_project.Data.Models;
using System.Text.Json.Serialization;

namespace WSB_Happy_Leash_project.Data.Models
{
    public class AdoptionRequest
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Pet")]
        public int PetId { get; set; }

        [JsonIgnore]
        public Pet? Pet { get; set; }

        [Required]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [JsonIgnore]
        public User? User { get; set; }

        public string? Message { get; set; }

        public DateTime RequestDate { get; set; } = DateTime.UtcNow;

        public bool IsApproved { get; set; } = false;
    }
}
