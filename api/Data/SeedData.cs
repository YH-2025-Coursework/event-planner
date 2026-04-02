using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using EventPlanner.Api.Models;

namespace EventPlanner.Api.Data
{
    public class SeedData
    {
        public static async Task InitializeAsync(
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager,
            AppDbContext context)
        {
            string[] roles = ["Admin", "User"];
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            await SeedUserAsync(userManager, "admin@example.com", "Admin", "Admin1234!", "Admin");
            await SeedUserAsync(userManager, "user@example.com", "Test User", "User1234!", "User");

            if (!await context.Categories.AnyAsync())
            {
                context.Categories.AddRange(
                    new Category { Name = "Music" },
                    new Category { Name = "Sports" },
                    new Category { Name = "Tech" }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.Events.AnyAsync())
            {
                var admin = await userManager.FindByEmailAsync("admin@example.com");

                var musicCat = await context.Categories.FirstAsync(c => c.Name == "Music");
                var sportsCat = await context.Categories.FirstAsync(c => c.Name == "Sports");
                var techCat = await context.Categories.FirstAsync(c => c.Name == "Tech");

                if (admin != null)
                {
                    context.Events.AddRange(
                        new Event
                        {
                            Title = "Rock in the Park",
                            Description = "A great rock concert.",
                            Location = "Central Park",
                            StartDate = DateTime.UtcNow.AddDays(7),
                            CategoryId = musicCat.Id,
                            OrganizerId = admin.Id
                        },
                        new Event
                        {
                            Title = "City Marathon",
                            Description = "Run through the city streets.",
                            Location = "Downtown",
                            StartDate = DateTime.UtcNow.AddDays(14),
                            CategoryId = sportsCat.Id,
                            OrganizerId = admin.Id
                        },
                        new Event
                        {
                            Title = "DotNet Conf 2026",
                            Description = "The latest in .NET.",
                            Location = "Convention Center",
                            StartDate = DateTime.UtcNow.AddDays(30),
                            CategoryId = techCat.Id,
                            OrganizerId = admin.Id
                        }
                    );
                    await context.SaveChangesAsync();
                }
            }
        }

        private static async Task SeedUserAsync(
            UserManager<ApplicationUser> userManager,
            string email,
            string displayName,
            string password,
            string role)
        {
            if (await userManager.FindByEmailAsync(email) is not null)
                return;

            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                DisplayName = displayName,
                EmailConfirmed = true
            };

            var result = await userManager.CreateAsync(user, password);

            if (result.Succeeded)
                await userManager.AddToRoleAsync(user, role);
            else
                throw new Exception(
                    $"Failed to seed user '{email}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }
    }
}