namespace WSB_Happy_Leash_project.Data.DTO
{
    public class TagDto
    {
        public int? Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public List<PetShortDto> Pets { get; set; } = new(); // do wyświetlania nazw zwierzaków
        public List<int> PetIds { get; set; } = new();       // do zapisu powiązań

    }

    public class PetShortDto //TODO konieczna dodatkowa klasa aby uniknąć wpadnięcia w pętlę cykliczności
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
