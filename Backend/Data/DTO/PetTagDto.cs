namespace WSB_Happy_Leash_project.Data.DTO
{
    public class PetTagDto
    {
        public int? Id { get; set; }

        public int PetId { get; set; }

        public int TagId { get; set; }

        public string? PetName { get; set; }

        public string? TagName { get; set; }
    }
}
