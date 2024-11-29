using Microsoft.AspNetCore.Mvc;
using Client_Homework.Server.DataAccess.Repository.IRepository;
using Client_Homework.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Client_Homework.Server.DTOs;

namespace Client_Homework.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ReviewListController : ControllerBase
	{
		private readonly IUnitOfWork _unitOfWork;

		public ReviewListController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
		}

		[HttpPost("AddReview")]
		public async Task<IActionResult> AddReview([FromBody] ReviewRequest reviewRequest)
		{
			if (string.IsNullOrWhiteSpace(reviewRequest.ReviewText))
			{
				return BadRequest("Review cannot be empty.");
			}

			var user = await _unitOfWork.ApplicationUser.GetAsync(u => u.Id == reviewRequest.UserId);

			if (user == null)
			{
				return NotFound("User not found.");
			}

			// Check if the user has already watched the movie
			var isWatched = await _unitOfWork.WatchList.GetAsync(w => w.WatchListOwnerId == reviewRequest.UserId && w.MovieId == reviewRequest.MovieId && w.IsWatched);
			if (isWatched == null)
			{
				return BadRequest("Movie must be marked as watched before adding a review.");
			}

			// Add the review to the user's review list
			var newReview = new ReviewList
			{
				ReviewListOwnerId = reviewRequest.UserId,
				MovieId = reviewRequest.MovieId,
				Content = reviewRequest.ReviewText,
				Rating = reviewRequest.Rating
			};

			if (user.ReviewList == null)
			{
				user.ReviewList = new List<ReviewList>();
			}
			user.ReviewList.Add(newReview);

			await _unitOfWork.ReviewList.AddAsync(newReview);
			_unitOfWork.ApplicationUser.Update(user);
			await _unitOfWork.SaveAsync();

			return Ok("Review added successfully.");
		}



		[HttpGet("{userId}/{movieId}")]
		public async Task<IActionResult> GetReview(Guid userId, int movieId) 
		{
			var review = await _unitOfWork.ReviewList.GetByUserAndMovieAsync(userId, movieId);

			if (review == null)
			{
				return NotFound();
			}

			return Ok(review);
		}

		[HttpGet("user/{userId}")]
		public async Task<IActionResult> GetReviewsByUser(Guid userId)
		{
			var reviews = await _unitOfWork.ReviewList.GetAllByUserAsync(userId);
			if (reviews == null || !reviews.Any())
			{
				return NotFound("No reviews found for this user.");
			}

			return Ok(reviews);
		}

		[HttpDelete("{userId}/{movieId}")]
		public async Task<IActionResult> DeleteReview(Guid userId, int movieId)
		{
			var review = await _unitOfWork.ReviewList.GetAsync(r => r.ReviewListOwnerId == userId && r.MovieId == movieId);

			if (review == null)
			{
				return NotFound("Review not found.");
			}

			await _unitOfWork.ReviewList.RemoveAsync(review);

			await _unitOfWork.SaveAsync();

			return NoContent();
		}
		[HttpPut("EditReview")]
		public async Task<IActionResult> EditReview([FromBody] ReviewRequest reviewRequest)
		{
			if (reviewRequest == null || string.IsNullOrWhiteSpace(reviewRequest.ReviewText))
			{
				return BadRequest("Review text cannot be empty.");
			}

			var review = await _unitOfWork.ReviewList.GetAsync(r => r.ReviewListOwnerId == reviewRequest.UserId && r.MovieId == reviewRequest.MovieId);

			if (review == null)
			{
				return NotFound("Review not found.");
			}

			// Update the review details
			review.Content = reviewRequest.ReviewText;
			review.Rating = reviewRequest.Rating;

			_unitOfWork.ReviewList.Update(review);
			await _unitOfWork.SaveAsync();

			return Ok("Review updated successfully.");
		}

		//[HttpGet("movie/{movieId}")]
		//public async Task<IActionResult> GetReviewsForMovie(int movieId)
		//{
		//	var reviews = await _unitOfWork.ReviewList.GetAllAsync(r => r.MovieId == movieId);

		//	if (reviews == null || !reviews.Any())
		//	{
		//		return NotFound("No reviews found for this movie.");
		//	}

		//	return Ok(reviews);
		//}

		[HttpGet("movie/{movieId}")]
		public async Task<IActionResult> GetReviewsForMovie(int movieId)
		{
			try
			{
				var reviews = await _unitOfWork.ReviewList.GetAllAsync(r => r.MovieId == movieId);

				if (reviews == null)
					return NotFound("Error occurred while fetching reviews.");  // Hiba esetén
				if (!reviews.Any())
					return Ok(new { message = "No reviews yet. Be the first to leave a review!" });  // Üres válasz, de nem hiba

				var reviewsWithUsernames = new List<object>();

				foreach (var review in reviews)
				{
					var user = _unitOfWork.ApplicationUser.Get(u => u.Id == review.ReviewListOwnerId);
					if (user == null)
						continue;

					reviewsWithUsernames.Add(new
					{
						review.ReviewListOwnerId,
						review.Content,
						review.Rating,
						review.CreatedAt,
						Username = user.Username
					});
				}

				return Ok(reviewsWithUsernames);  // Visszaadjuk a review-kat
			}
			catch (Exception ex)
			{
				return StatusCode(500, $"Internal server error: {ex.Message}");  // Hiba esetén
			}
		}

	}
}
