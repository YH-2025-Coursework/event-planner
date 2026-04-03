using System.ComponentModel.DataAnnotations;

namespace EventPlanner.Api.DTOs;

public class RegisterRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; set; } = null!;

    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string Password { get; set; } = null!;

    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public string DisplayName { get; set; } = null!;
}