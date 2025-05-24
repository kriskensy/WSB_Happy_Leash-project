namespace WSB_Happy_Leash_project.Data.DTO
{
    public class HealthRecordDto
    {
        public int? Id { get; set; } // Nullable, bo przy POST nie jest wymagane

        public int PetId { get; set; }

        public string Description { get; set; } = string.Empty;

        public DateTime RecordDate { get; set; }

        public string VetName { get; set; } = string.Empty;

        // tylko do odczytu
        public string? PetName { get; set; }
    }
}
