using EventPlanner.Api.Data;
using EventPlanner.Api.DTOs;
using EventPlanner.Api.Exceptions;
using EventPlanner.Api.Models;
using EventPlanner.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace EventPlanner.Api.Tests;

public class EventServiceTests
{
    private AppDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    private async Task<(ApplicationUser user, Category category)> SeedDependenciesAsync(AppDbContext db)
    {
        var user = new ApplicationUser { Id = "user-1", UserName = "test@test.com", DisplayName = "Test User" };
        var category = new Category { Name = "Music" };
        db.Users.Add(user);
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return (user, category);
    }
    private async Task<Event> SeedEventAsync(AppDbContext db, ApplicationUser user, Category category)
    {
        var ev = new Event
        {
            Title = "Concert",
            Description = "Fun",
            Location = "Oslo",
            StartDate = DateTime.UtcNow,
            CategoryId = category.Id,
            OrganizerId = user.Id
        };
        db.Events.Add(ev);
        await db.SaveChangesAsync();
        return ev;
    }


    [Fact]
    public async Task GetAllAsync_ReturnsSeededEvents()
    {
        var db = CreateDb();
        var (user, category) = await SeedDependenciesAsync(db);
        await SeedEventAsync(db, user, category);
        var service = new EventService(db);

        var result = await service.GetAllAsync();

        Assert.Single(result);
        Assert.Equal("Concert", result.First().Title);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsCorrectEvent()
    {
        var db = CreateDb();
        var (user, category) = await SeedDependenciesAsync(db);
        var ev = await SeedEventAsync(db, user, category);
        var service = new EventService(db);

        var result = await service.GetByIdAsync(ev.Id);

        Assert.Equal(ev.Id, result.Id);
        Assert.Equal("Concert", result.Title);
        Assert.Equal("Music", result.CategoryName);
        Assert.Equal("Test User", result.OrganizerDisplayName);
    }

    [Fact]
    public async Task GetByIdAsync_ThrowsNotFoundException_WhenMissing()
    {
        var service = new EventService(CreateDb());

        await Assert.ThrowsAsync<NotFoundException>(() => service.GetByIdAsync(999));
    }

    [Fact]
    public async Task CreateAsync_PersistsAndReturnsEvent()
    {
        // Arrange
        var db = CreateDb();
        var (user, category) = await SeedDependenciesAsync(db);
        var service = new EventService(db);

        var request = new CreateEventRequest
        {
            Title = "Festival",
            Description = "Outdoor",
            Location = "Bergen",
            StartDate = DateTime.UtcNow,
            CategoryId = category.Id
        };

        // Act
        var result = await service.CreateAsync(request, user.Id);

        // Assert
        Assert.Equal("Festival", result.Title);
        Assert.Equal("Music", result.CategoryName);
        Assert.Equal("Test User", result.OrganizerDisplayName);
        Assert.Equal(1, await db.Events.CountAsync());
    }

    [Fact]
    public async Task UpdateAsync_UpdatesFields()
    {
        // Arrange
        var db = CreateDb();
        var (user, category) = await SeedDependenciesAsync(db);
        var ev = await SeedEventAsync(db, user, category);
        var service = new EventService(db);

        var request = new UpdateEventRequest
        {
            Title = "Updated Concert",
            Description = "Even more fun",
            Location = "Bergen",
            StartDate = DateTime.UtcNow,
            CategoryId = category.Id
        };

        // Act
        var result = await service.UpdateAsync(ev.Id, request);

        // Assert
        Assert.Equal("Updated Concert", result.Title);
        Assert.Equal("Bergen", result.Location);
        Assert.Equal("Even more fun", result.Description);
    }

    [Fact]
    public async Task UpdateAsync_ThrowsNotFoundException_WhenMissing()
    {
        // Arrange
        var service = new EventService(CreateDb());
        var request = new UpdateEventRequest { Title = "Ghost", Description = "X", Location = "X", StartDate = DateTime.UtcNow, CategoryId = 1 };

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => service.UpdateAsync(999, request));
    }
    [Fact]
    public async Task DeleteAsync_RemovesEvent()
    {
        // Arrange
        var db = CreateDb();
        var (user, category) = await SeedDependenciesAsync(db);
        var ev = await SeedEventAsync(db, user, category);
        var service = new EventService(db);

        // Act
        await service.DeleteAsync(ev.Id);

        // Assert
        Assert.Equal(0, await db.Events.CountAsync());
    }

    [Fact]
    public async Task DeleteAsync_ThrowsNotFoundException_WhenMissing()
    {
        // Arrange
        var service = new EventService(CreateDb());

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(() => service.DeleteAsync(999));
    }

}
