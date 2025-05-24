namespace WSB_Happy_Leash_project.Data.DTO
{
    public class PetTypeDto
    {
        public int? Id { get; set; } // nullable, bo przy POST nie jest wymagane

        public string Name { get; set; } = string.Empty;

    }
}
