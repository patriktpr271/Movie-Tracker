using Client_Homework.Server.DataAccess.Data;
using Client_Homework.Server.DataAccess.Repository.IRepository;
using Client_Homework.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Client_Homework.Server.DataAccess.Repository
{
	public class WatchListRepository : Repository<WatchList>, IWatchListRepository
	{
		private readonly ApplicationDbContext _db;

		public WatchListRepository(ApplicationDbContext db) : base(db)
		{
			_db = db;
		}

		public void Update(WatchList reviewList)
		{
			_db.WatchLists.Update(reviewList);
		}

		public async Task<WatchList?> GetByUserAndMovieAsync(Guid userId, int movieId)
		{
			return await _db.WatchLists
				.FirstOrDefaultAsync(wl => wl.WatchListOwnerId == userId && wl.MovieId == movieId);
		}

		public async Task<IEnumerable<WatchList>> GetAllByUserAsync(Guid userId)
		{
			return await _db.WatchLists
				.Where(wl => wl.WatchListOwnerId == userId)
				.ToListAsync();
		}

		public async Task<WatchList?> GetAsync(int id)
		{
			return await _db.WatchLists.FindAsync(id);
		}

		public async Task RemoveAsync(WatchList watchList)
		{
			_db.WatchLists.Remove(watchList);
			await _db.SaveChangesAsync();
		}

		public async Task UpdateAsync(WatchList item)
		{
			var existingItem = await _db.WatchLists
				.FirstOrDefaultAsync(wl => wl.WatchListOwnerId == item.WatchListOwnerId && wl.MovieId == item.MovieId);

			if (existingItem == null)
			{
				throw new KeyNotFoundException("WatchList item not found.");
			}

			existingItem.IsWatched = item.IsWatched;

			_db.WatchLists.Update(existingItem);
			await _db.SaveChangesAsync();
		}
	}
}