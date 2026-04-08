using EventPlanner.Api.Data;
using EventPlanner.Api.Exceptions;
using EventPlanner.Api.Models;
using EventPlanner.Api.Services;
using EventPlanner.Api.DTOs;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace EventPlanner.Api.Tests;

public class RsvpServiceTests
{
    private DbContextOptions<AppDbContext> CreateNewContextOptions()
    {
        // Use a unique name for each test to ensure total isolation
        return new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
    }

    [Fact]
    public async Task GetMyRsvpsAsync_ReturnsOnlyUsersRsvps()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new AppDbContext(options);
        
        // CRITICAL: We must add the Events first so the RSVPs have something to link to.
        context.Events.AddRange(
            new Event { Id = 101, Title = "Event 1" },
            new Event { Id = 102, Title = "Event 2" }
        );

        var userId = "user-1";
        context.Rsvps.AddRange(
            new Rsvp { EventId = 101, UserId = userId },
            new Rsvp { EventId = 102, UserId = "other-user" }
        );
        await context.SaveChangesAsync();

        var service = new RsvpService(context);

        // Act
        var result = await service.GetMyRsvpsAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Single(result); // Should find only the RSVP for user-1
        Assert.Equal(101, result.First().EventId);
    }

    [Fact]
    public async Task CreateAsync_ThrowsNotFound_WhenEventDoesNotExist()
    {
        var options = CreateNewContextOptions();
        using var context = new AppDbContext(options);
        var service = new RsvpService(context);
        var request = new CreateRsvpRequest { EventId = 999 };

        await Assert.ThrowsAsync<NotFoundException>(() => 
            service.CreateAsync(request, "user-1"));
    }

    [Fact]
    public async Task CreateAsync_PersistsRsvp_OnSuccess()
    {
        var options = CreateNewContextOptions();
        using var context = new AppDbContext(options);
        context.Events.Add(new Event { Id = 1, Title = "Test Event" });
        await context.SaveChangesAsync();
        
        var service = new RsvpService(context);
        var request = new CreateRsvpRequest { EventId = 1 };

        var response = await service.CreateAsync(request, "user-1");

        Assert.Equal(1, response.EventId);
        Assert.Equal(request.Status, response.Status);
        var rsvp = await context.Rsvps.FirstOrDefaultAsync(r => r.EventId == 1 && r.UserId == "user-1");
        Assert.NotNull(rsvp);
    }

    [Fact]
    public async Task DeleteAsync_RemovesRsvp_WhenOwner()
    {
        var options = CreateNewContextOptions();
        using var context = new AppDbContext(options);
        context.Rsvps.Add(new Rsvp { Id = 5, EventId = 1, UserId = "user-1" });
        await context.SaveChangesAsync();
        
        var service = new RsvpService(context);

        await service.DeleteAsync(5, "user-1");

        var rsvp = await context.Rsvps.FindAsync(5);
        Assert.Null(rsvp);
    }

    [Fact]
    public async Task DeleteAsync_ThrowsForbidden_WhenNotOwner()
    {
        var options = CreateNewContextOptions();
        using var context = new AppDbContext(options);
        context.Rsvps.Add(new Rsvp { Id = 5, UserId = "owner-id", EventId = 1 });
        await context.SaveChangesAsync();
        
        var service = new RsvpService(context);

        await Assert.ThrowsAsync<ForbiddenException>(() => 
            service.DeleteAsync(5, "hacker-id"));
    }

    [Fact]
    public async Task DeleteAsync_ThrowsNotFound_WhenRsvpDoesNotExist()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new AppDbContext(options);
        var service = new RsvpService(context);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => 
            service.DeleteAsync(999, "user-1"));
    }

    [Fact]
    public async Task CreateAsync_ThrowsInvalidOperation_OnDuplicateRsvp()
    {
        // Arrange
        var options = CreateNewContextOptions();
        using var context = new AppDbContext(options);
        
        context.Events.Add(new Event { Id = 1, Title = "Test Event" });
        context.Rsvps.Add(new Rsvp { EventId = 1, UserId = "user-1" });
        await context.SaveChangesAsync();
        
        var service = new RsvpService(context);
        var request = new CreateRsvpRequest { EventId = 1 };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => 
            service.CreateAsync(request, "user-1"));
    }
}