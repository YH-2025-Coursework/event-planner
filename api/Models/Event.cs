namespace EventPlanner.Api.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public int CategoryId { get; set; }
        public string OrganizerId { get; set; } = string.Empty;
        public Category? Category { get; set; }
        public ApplicationUser? Organizer { get; set; }
        public ICollection<Rsvp> Rsvps { get; set; } = new List<Rsvp>();
    }
}
