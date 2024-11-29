using Client_Homework.Server.Models;

namespace Client_Homework.Server.DataAccess.Repository.IRepository
{
	public interface IWatchListRepository : IRepository<WatchList>
	{
		void Update(WatchList watchList);

		public Task<IEnumerable<WatchList?>> GetAllByUserAsync(Guid guid);

		public Task<WatchList?> GetByUserAndMovieAsync(Guid userId, int movieId);
		public Task RemoveAsync(WatchList item);
	}
}