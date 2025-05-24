namespace WSB_Happy_Leash_project.Data.DTO
{
    public class AdoptionRequestDto
    {
        public int? Id { get; set; }
        public int PetId { get; set; }
        public int UserId { get; set; }
        public string? Message { get; set; }
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public bool IsApproved { get; set; } = false;

        public string? PetName { get; set; }
        public string? UserName { get; set; }
    }
}