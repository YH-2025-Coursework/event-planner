namespace EventPlanner.Api.Models
{
    public class Rsvp
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int EventId { get; set; }
        public enum Status { Going, Maybe, NotGoing}
    }
}
