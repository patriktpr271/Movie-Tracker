using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Client_Homework.Server.Models
{
	public class ApplicationUser
	{
		[Key]
		public Guid Id { get; set; }

		[Required]
		public string Username { get; set; }

		[Required]
		[EmailAddress]
		public string Email { get; set; }
		public string Name { get; set; }
		public int? WatchedMoviesCount { get; set; }
		public int? ReviewsCount { get; set; }
		[Required]
		public string Password { get; set; }

		public ICollection<WatchList>? WatchList { get; set; } = new List<WatchList>();

		public ICollection<ReviewList>? ReviewList { get; set; } = new List<ReviewList>();

	}
}
