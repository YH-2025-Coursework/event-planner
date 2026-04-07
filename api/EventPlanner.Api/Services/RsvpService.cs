using EventPlanner.Api.Data;
using EventPlanner.Api.DTOs;
using EventPlanner.Api.Exceptions;
using EventPlanner.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Api.Services;

public class RsvpService : IRsvpService
{
    private readonly AppDbContext _db;

    public RsvpService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<RsvpResponse>> GetMyRsvpsAsync(string userId)
    {
        return await _db.Rsvps
            .Include(r => r.Event)
            .Where(r => r.UserId == userId)
            .Select(r => ToResponse(r))
            .ToListAsync();
    }

    public async Task<RsvpResponse> CreateAsync(CreateRsvpRequest request, string userId)
    {
        var eventExists = await _db.Events.AnyAsync(e => e.Id == request.EventId);
        if (!eventExists)
            throw new NotFoundException($"Event with ID {request.EventId} was not found.");

        var duplicate = await _db.Rsvps.AnyAsync(r => r.UserId == userId && r.EventId == request.EventId);
        if (duplicate)
            throw new InvalidOperationException("You have already RSVP'd to this event.");

        var rsvp = new Rsvp
        {
            UserId = userId,
            EventId = request.EventId,
            Status = request.Status
        };

        _db.Rsvps.Add(rsvp);
        await _db.SaveChangesAsync();

        await _db.Entry(rsvp).Reference(r => r.Event).LoadAsync();

        return ToResponse(rsvp);
    }

    public async Task DeleteAsync(int id, string userId)
    {
        var rsvp = await _db.Rsvps.FindAsync(id);

        if (rsvp == null)
            throw new NotFoundException($"RSVP with ID {id} was not found.");

        if (rsvp.UserId != userId)
            throw new ForbiddenException("You do not have permission to cancel this RSVP.");

        _db.Rsvps.Remove(rsvp);
        await _db.SaveChangesAsync();
    }

    private static RsvpResponse ToResponse(Rsvp rsvp) => new()
    {
        Id = rsvp.Id,
        EventId = rsvp.EventId,
        EventTitle = rsvp.Event?.Title ?? string.Empty,
        Status = rsvp.Status
    };
}
