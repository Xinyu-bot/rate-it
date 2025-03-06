using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("entities")]
    public class Entity
    {
        [Key]
        [Column("id")]
        public Guid Id { get; set; }

        [Column("name")]
        public required string Name { get; set; }

        [Column("slug")]
        public required string Slug { get; set; }

        [Column("category_id")]
        public Guid CategoryId { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("created_by")]
        public Guid CreatedBy { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("is_approved")]
        public bool IsApproved { get; set; }
    }
} 