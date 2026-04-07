using EventPlanner.Api.DTOs;

namespace EventPlanner.Api.Services;

public interface IEventService
{
    Task<IEnumerable<EventResponse>> GetAllAsync();
    Task<EventResponse> GetByIdAsync(int id);
    Task<EventResponse> CreateAsync(CreateEventRequest request, string organizerId);
    Task<EventResponse> UpdateAsync(int id, UpdateEventRequest request);
    Task DeleteAsync(int id);
}
