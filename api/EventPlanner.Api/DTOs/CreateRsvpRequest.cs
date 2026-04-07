using EventPlanner.Api.Models;

namespace EventPlanner.Api.DTOs;

public class CreateRsvpRequest
{
    public int EventId { get; set; }
    public Rsvp.RsvpStatus Status { get; set; }
}
