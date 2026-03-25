using System;

namespace Olympus.Core.Entities;

public class MemoryFact : BaseEntity
{
    public string AgentId { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public double Importance { get; set; } = 1.0;
    public string? MetadataJson { get; set; }
}
