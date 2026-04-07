using EventPlanner.Api.Models;

namespace EventPlanner.Api.DTOs;

public class RsvpResponse
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public Rsvp.RsvpStatus Status { get; set; }
}
