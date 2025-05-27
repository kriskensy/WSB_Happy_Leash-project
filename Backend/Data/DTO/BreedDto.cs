namespace WSB_Happy_Leash_project.Data.DTO
{
    public class BreedDto
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public int PetTypeId { get; set; } //TODO dodane pole bo brakowało i tworzenie zwierzaka nie działało
        public string PetTypeName { get; set; }
    }
}