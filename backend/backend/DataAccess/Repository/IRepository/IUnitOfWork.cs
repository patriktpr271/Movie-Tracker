namespace Client_Homework.Server.DataAccess.Repository.IRepository
{
	public interface IUnitOfWork
	{
		IApplicationUserRepository ApplicationUser { get; }
		IWatchListRepository WatchList { get; }
		IReviewListRepository ReviewList { get; }
		void Save();

		public Task SaveAsync();
	}
}
