using Microsoft.AspNetCore.Identity;

namespace EventPlanner.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
        public ICollection<Rsvp> RSVPs { get; set; }
        public ICollection<Event> OrganizedEvents { get; set; }
    }
}
