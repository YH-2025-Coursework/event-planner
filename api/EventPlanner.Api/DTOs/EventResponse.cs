namespace EventPlanner.Api.DTOs;

public class EventResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public string OrganizerId { get; set; } = string.Empty;
    public string OrganizerDisplayName { get; set; } = string.Empty;
}
