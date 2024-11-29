using System.Linq.Expressions;

namespace Client_Homework.Server.DataAccess.Repository.IRepository
{
	public interface IRepository<T> where T : class
	{
		IEnumerable<T> GetAll(Expression<Func<T, bool>>? filter = null, string? includeProperties = null);
		T Get(Expression<Func<T, bool>> filter, string? includeProperties = null);
		void Add(T entity);
		void Remove(T entity);
		void RemoveRange(IEnumerable<T> entity);
		Task<T> GetAsync(Expression<Func<T, bool>> filter, string? includeProperties = null);
		Task AddAsync(T entity);
		Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null);
	}
}
