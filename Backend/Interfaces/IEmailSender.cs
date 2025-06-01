using WSB_Happy_Leash_project.Data.Models;

namespace WSB_Happy_Leash_project.Backend.Interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(Message message);
    }
}