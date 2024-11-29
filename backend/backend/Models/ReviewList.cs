using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Client_Homework.Server.Models
{
	public class ReviewList
	{

		[Required]
		public Guid ReviewListOwnerId { get; set; }  // A felhasználó, aki az értékelést írta

		[Required]
		public int MovieId { get; set; }  // Az értékelt film TMDb ID-ja

		[Required]
		public string Content { get; set; }  // Az értékelés szöveges tartalma

		ReviewList(Guid userId, int movieId)
		{
			ReviewListOwnerId = userId;
			MovieId = movieId;
		}
		public ReviewList()
		{

		}

		[Range(1, 10)]
		[Required]
		public double? Rating { get; set; }  // Értékelés pontszáma 1-től 10-ig terjedő skálán

		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Az értékelés létrehozásának dátuma és ideje
	}
}
