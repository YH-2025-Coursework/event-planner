using Microsoft.AspNetCore.Identity;

namespace EventPlanner.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; } = string.Empty;
        public ICollection<Rsvp> RSVPs { get; set; } = new List<Rsvp>();
        public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();
    }
}
