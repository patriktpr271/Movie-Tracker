using Client_Homework.Server.DataAccess.Data;
using Client_Homework.Server.DataAccess.Repository.IRepository;
using Client_Homework.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Client_Homework.Server.DataAccess.DbInitalizer
{
	public class DbInitalizer : IDbInitalizer
	{
		private readonly UserManager<IdentityUser> _userManager;
		private readonly ApplicationDbContext _db;
		private readonly PasswordHasher<ApplicationUser> _passwordHasher;
		private readonly IUnitOfWork _unitOfWork;

		public DbInitalizer(
			ApplicationDbContext db,
			IUnitOfWork unitOfWork)
		{
			_db = db;
			_unitOfWork = unitOfWork;
			_passwordHasher = new PasswordHasher<ApplicationUser>();
		}

		public void Initialize()
		{
			// Migrations if they are not applied
			try
			{
				// Use IMigrator to get pending migrations
				var pendingMigrations = _db.Database.GetPendingMigrations();
				if (pendingMigrations.Any())
				{
					_db.Database.Migrate();
				}
			}
			catch (Exception ex)
			{
				// Handle migration exception if necessary
				Console.WriteLine("Error during migration: " + ex.Message);
			}

			// If there are no users in the database
			if (_db.ApplicationUsers.Count() == 0)
			{
				// Create a new user
				ApplicationUser user = new ApplicationUser
				{
					Id = Guid.NewGuid(),
					Username = "patriktpr271",
					Email = "timapatrik27@gmail.com",
					Name = "Tima Patrik Richárd",
					WatchedMoviesCount = 0,
					ReviewsCount = 0,
					Password = "Password123@"
				};

				user.Password = _passwordHasher.HashPassword(user, user.Password);

				// Add the user to the database
				_unitOfWork.ApplicationUser.Add(user);
				_unitOfWork.Save();
			}

			return;
		}
	}
}
