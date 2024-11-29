using Client_Homework.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Client_Homework.Server.DataAccess.Repository.IRepository
{
	public interface IReviewListRepository : IRepository<ReviewList>
	{
		void Update(ReviewList reviewList);

		public Task<IEnumerable<ReviewList>> GetAllByUserAsync(Guid guid);
		public Task<ReviewList> GetByUserAndMovieAsync(Guid userId, int movieId);
		public Task RemoveAsync(ReviewList review);
	}
}
