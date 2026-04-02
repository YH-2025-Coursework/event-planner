using Microsoft.AspNetCore.Identity;
using EventPlanner.Api.Models;
namespace EventPlanner.Api.Data
{
    public class SeedData
    {
        public static async Task InitializeAsync(
            RoleManager<IdentityRole> roleManager,
            UserManager<ApplicationUser> userManager
            )
        {
            string[] roles = ["Admin", "User"];

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            await SeedUserAsync(
                userManager,
                email: "admin@example.com",
                displayName: "Admin",
                password: "Admin1234!",
                role: "Admin"
            );

            await SeedUserAsync(
                userManager,
                email: "user@example.com",
                displayName: "Test User",
                password: "User1234!",
                role: "User"
            );
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
