using Client_Homework.Server.DataAccess.Data;
using Client_Homework.Server.DataAccess.Repository.IRepository;
using Client_Homework.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Client_Homework.Server.DataAccess.Repository
{
	public class ReviewListRepository : Repository<ReviewList>, IReviewListRepository
	{
		private readonly ApplicationDbContext _db;

		public ReviewListRepository(ApplicationDbContext db) : base(db)
		{
			_db = db;
		}

		public void Update(ReviewList reviewList)
		{
			_db.ReviewLists.Update(reviewList);
		}

		public async Task<ReviewList> GetByUserAndMovieAsync(Guid userId, int movieId)
		{
			return await _db.ReviewLists.FirstOrDefaultAsync(wl => wl.ReviewListOwnerId == userId && wl.MovieId == movieId);
		}

		public async Task<IEnumerable<ReviewList>> GetAllByUserAsync(Guid guid)
		{
			return await _db.ReviewLists.Where(wl => wl.ReviewListOwnerId == guid).ToListAsync();
		}
		public async Task RemoveAsync(ReviewList review)
		{
			_db.ReviewLists.Remove(review);
			await _db.SaveChangesAsync();
		}
	}
}