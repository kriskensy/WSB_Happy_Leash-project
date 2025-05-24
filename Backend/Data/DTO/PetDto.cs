using WSB_Happy_Leash_project.Data.Models;

public class PetDto
{
    public int? Id { get; set; }
    public string? Name { get; set; }
    public int Age { get; set; }
    public double Weight { get; set; }
    public Gender Gender { get; set; }
    public string Notes { get; set; }
    public int? BreedId { get; set; }
    public string? PictureURL { get; set; }
    public string? BreedName { get; set; }
    public string? PetTypeName { get; set; }
}
