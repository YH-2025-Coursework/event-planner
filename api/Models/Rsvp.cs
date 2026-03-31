namespace EventPlanner.Api.Models
{
    public class Rsvp
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int EventId { get; set; }
        public enum Status { Going = 0, Maybe = 1, NotGoing = 2}
        public ApplicationUser? User { get; set; }
        public Event? Event { get; set; }
    }
}
