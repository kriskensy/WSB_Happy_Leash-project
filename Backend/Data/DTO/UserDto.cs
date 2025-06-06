using System;
using WSB_Happy_Leash_project.Data.Models;

namespace WSB_Happy_Leash_project.Data.DTO
{
    public class UserDto
    {
        public int? Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public string? Password { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Address { get; set; }
        public string? City { get; set; }
        public string? PostalCode { get; set; }
        public string? Country { get; set; }
        public string? ProfilePictureURL { get; set; }

        public DateTime? CreatedAt { get; set; }
        public UserType? UserType { get; set; }
    }
}
