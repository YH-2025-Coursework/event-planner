using EventPlanner.Api.Data;
using EventPlanner.Api.DTOs;
using EventPlanner.Api.Exceptions;
using EventPlanner.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Api.Services;

public class EventService : IEventService
{
    private readonly AppDbContext _db;

    public EventService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IEnumerable<EventResponse>> GetAllAsync()
    {
        return await _db.Events
            .Include(e => e.Category)
            .Include(e => e.Organizer)
            .Select(e => ToResponse(e))
            .ToListAsync();
    }

    public async Task<EventResponse> GetByIdAsync(int id)
    {
        var ev = await _db.Events
            .Include(e => e.Category)
            .Include(e => e.Organizer)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (ev == null)
            throw new NotFoundException($"Event with ID {id} was not found.");

        return ToResponse(ev);
    }

    public async Task<EventResponse> CreateAsync(CreateEventRequest request, string organizerId)
    {
        var ev = new Event
        {
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            StartDate = request.StartDate,
            CategoryId = request.CategoryId,
            OrganizerId = organizerId
        };

        _db.Events.Add(ev);
        await _db.SaveChangesAsync();

        // Reload with navigation properties so the response is fully populated
        return await GetByIdAsync(ev.Id);
    }

    public async Task<EventResponse> UpdateAsync(int id, UpdateEventRequest request)
    {
        var ev = await _db.Events.FindAsync(id);

        if (ev == null)
            throw new NotFoundException($"Event with ID {id} was not found.");

        ev.Title = request.Title;
        ev.Description = request.Description;
        ev.Location = request.Location;
        ev.StartDate = request.StartDate;
        ev.CategoryId = request.CategoryId;

        await _db.SaveChangesAsync();

        return await GetByIdAsync(ev.Id);
    }

    public async Task DeleteAsync(int id)
    {
        var ev = await _db.Events.FindAsync(id);

        if (ev == null)
            throw new NotFoundException($"Event with ID {id} was not found.");

        _db.Events.Remove(ev);
        await _db.SaveChangesAsync();
    }

    private static EventResponse ToResponse(Event ev) => new()
    {
        Id = ev.Id,
        Title = ev.Title,
        Description = ev.Description,
        Location = ev.Location,
        StartDate = ev.StartDate,
        CategoryId = ev.CategoryId,
        CategoryName = ev.Category?.Name ?? string.Empty,
        OrganizerId = ev.OrganizerId,
        OrganizerDisplayName = ev.Organizer?.DisplayName ?? string.Empty
    };
}
