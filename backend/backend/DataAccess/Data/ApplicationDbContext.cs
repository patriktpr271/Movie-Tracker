using Client_Homework.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Client_Homework.Server.DataAccess.Data
{
	public class ApplicationDbContext :DbContext
	{
		public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
		{

		}

		public DbSet<ApplicationUser> ApplicationUsers { get; set; }

		public DbSet<ReviewList> ReviewLists { get; set; }
		public DbSet<WatchList> WatchLists { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			// Configuring composite keys
			builder.Entity<WatchList>()
				.HasKey(w => new { w.WatchListOwnerId, w.MovieId });

			builder.Entity<ReviewList>()
				.HasKey(r => new { r.ReviewListOwnerId, r.MovieId });


			base.OnModelCreating(builder);
		}
	}
}
