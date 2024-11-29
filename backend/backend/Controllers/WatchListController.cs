using Microsoft.AspNetCore.Mvc;
using Client_Homework.Server.DataAccess.Repository.IRepository;
using Client_Homework.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Client_Homework.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class WatchListController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;

		public WatchListController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
		}

		[HttpPost("AddToWatchList")]
		public async Task<IActionResult> AddToWatchList(Guid userId, int movieId)
		{
			if (userId == Guid.Empty || movieId == 0)
			{
				return BadRequest("Invalid user ID or movie ID.");
			}

			// Check if the movie is already in the watchlist for the user
			var existingItem = await _unitOfWork.WatchList.GetByUserAndMovieAsync(userId, movieId);
			if (existingItem != null)
			{
				return BadRequest("Movie is already in watchlist.");
			}

			// Create the WatchList object
			var watchList = new WatchList
			{
				WatchListOwnerId = userId,
				MovieId = movieId,
				IsWatched = false,  // Assuming this is false when added
			};

			// Add to watchlist
			await _unitOfWork.WatchList.AddAsync(watchList);
			await _unitOfWork.SaveAsync();

			return CreatedAtAction(nameof(GetWatchList), new { userId = userId }, watchList);
		}


		[HttpGet("{userId}")]
		public async Task<IActionResult> GetWatchList(Guid userId)
		{
			var watchList = await _unitOfWork.WatchList.GetAllByUserAsync(userId);
			if (watchList == null || !watchList.Any())
			{
				return NotFound("Watchlist is empty.");
			}

			return Ok(watchList);
		}

		[HttpPut("{movieId}")]
		public async Task<IActionResult> MarkAsWatched(Guid userId, int movieId)
		{
			var item = await _unitOfWork.WatchList.GetByUserAndMovieAsync(userId, movieId);
			if (item == null)
			{
				return NotFound("Movie not found in watchlist.");
			}

			item.IsWatched = true;
			_unitOfWork.WatchList.Update(item);
			await _unitOfWork.SaveAsync();

			return Ok(item);
		}

		[HttpDelete("{userId}/{movieId}")]
		public async Task<IActionResult> RemoveFromWatchList(Guid userId, int movieId)
		{
			var item = await _unitOfWork.WatchList.GetByUserAndMovieAsync(userId, movieId);
			if (item == null)
			{
				return NotFound("Movie not found in watchlist.");
			}

			await _unitOfWork.WatchList.RemoveAsync(item);
			await _unitOfWork.SaveAsync();

			return NoContent();
		}

		[HttpGet("IsMovieWatched")]
		public async Task<IActionResult> IsMovieWatched(Guid userId, int movieId)
		{
			// Assuming you have a DbContext for accessing the database
			var movie = await _unitOfWork.WatchList.GetByUserAndMovieAsync(userId, movieId);
			if (movie == null)
			{
				return NotFound("Movie not found in watchlist.");
			}

			bool isWatched = movie.IsWatched;				

			return Ok(isWatched);
		}
	}
}
