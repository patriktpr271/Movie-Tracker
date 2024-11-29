using Client_Homework.Server.DataAccess.Data;
using Client_Homework.Server.DataAccess.Repository.IRepository;

namespace Client_Homework.Server.DataAccess.Repository
{
	public class UnitOfWork : IUnitOfWork
	{
		private ApplicationDbContext _db;
		public IApplicationUserRepository ApplicationUser { get; private set; }
		public IWatchListRepository WatchList { get; private set; }
		public IReviewListRepository ReviewList { get; private set; }
		public UnitOfWork(ApplicationDbContext db)
		{
			_db = db;
			ApplicationUser = new ApplicationUserRepository(_db);
			WatchList = new WatchListRepository(_db);
			ReviewList = new ReviewListRepository(_db);
		}
		public void Save()
		{
			_db.SaveChanges(); ;
		}

		public async Task SaveAsync()
		{
			await _db.SaveChangesAsync();
		}
	}
}
