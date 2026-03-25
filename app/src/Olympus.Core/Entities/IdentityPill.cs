using System;

namespace Olympus.Core.Entities;

public class IdentityPill : BaseEntity
{
    public string TelegramId { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public bool IsActive { get; set; } = true;
}
