namespace EventPlanner.Api.Models
{
    public class Event
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime StartDate { get; set; }
        public int CategoryId { get; set; }
        public int OrganizerId { get; set; }
    }
}
