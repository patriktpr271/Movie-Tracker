using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Client_Homework.Server.Models
{
	public class WatchList
	{
		[Required]
		public Guid WatchListOwnerId { get; set; } // Felhasználó ID-ja

		[Required]
		public int MovieId { get; set; } // TMDB film ID-ja

		public bool IsWatched { get; set; } = false; 

		
		public WatchList(Guid userId, int movieId)
		{
			WatchListOwnerId = userId;
			MovieId = movieId;
			IsWatched = false;
		}

		public WatchList()
		{

		}
	}
}
