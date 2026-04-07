using EventPlanner.Api.DTOs;
using EventPlanner.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EventPlanner.Api.Controllers;

[ApiController]
[Route("api/rsvps")]
[Authorize]
public class RsvpsController : ControllerBase
{
    private readonly IRsvpService _rsvpService;

    public RsvpsController(IRsvpService rsvpService)
    {
        _rsvpService = rsvpService;
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyRsvps()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var rsvps = await _rsvpService.GetMyRsvpsAsync(userId);
        return Ok(rsvps);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRsvpRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var rsvp = await _rsvpService.CreateAsync(request, userId);
        return StatusCode(201, rsvp);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _rsvpService.DeleteAsync(id, userId);
        return NoContent();
    }
}
