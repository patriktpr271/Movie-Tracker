using Client_Homework.Server.DataAccess.Data;
using Client_Homework.Server.DataAccess.Repository.IRepository;
using Client_Homework.Server.Models;

namespace Client_Homework.Server.DataAccess.Repository
{
	public class ApplicationUserRepository : Repository<ApplicationUser>, IApplicationUserRepository
	{
		private ApplicationDbContext _db;

		public ApplicationUserRepository(ApplicationDbContext db) : base(db)
		{
			_db = db;
		}

		public void Update(ApplicationUser applicationUser)
		{
			_db.ApplicationUsers.Update(applicationUser);
		}
	}
}
