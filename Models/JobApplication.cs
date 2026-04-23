using System.ComponentModel.DataAnnotations;

public class JobApplication
{
    public int Id { get; set; }
    public string ?Description { get; set; }
    [Required]
    public required string Company { get; set; }
    [Required]
    public required string Position { get; set; }
    public JobStatus Status { get; set; }
}