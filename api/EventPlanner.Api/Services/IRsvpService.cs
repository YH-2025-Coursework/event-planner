using EventPlanner.Api.DTOs;

namespace EventPlanner.Api.Services;

public interface IRsvpService
{
    Task<IEnumerable<RsvpResponse>> GetMyRsvpsAsync(string userId);
    Task<RsvpResponse> CreateAsync(CreateRsvpRequest request, string userId);
    Task DeleteAsync(int id, string userId);
}
