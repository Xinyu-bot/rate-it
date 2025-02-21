using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("user_detail")]
    public class UserDetail
    {
        [Key]
        [Column("user_id")]
        public Guid UserId { get; set; }

        [Column("user_name")]
        public required string UserName { get; set; }

        [Column("user_points_balance")]
        public long UserPointsBalance { get; set; } // default is 0 points

        [Column("user_permission")]
        public int UserPermission { get; set; } // 1: normal user

        [Column("user_status")]
        public int UserStatus { get; set; } // 1: active

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
