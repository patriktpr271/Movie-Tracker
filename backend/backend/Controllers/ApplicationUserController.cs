using Client_Homework.Server.DataAccess.Repository.IRepository;
using Client_Homework.Server.DTOs;
using Client_Homework.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Client_Homework.Server.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ApplicationUserController : Controller
	{

		private readonly IUnitOfWork _unitOfWork;
		private readonly PasswordHasher<ApplicationUser> _passwordHasher;

		public ApplicationUserController(IUnitOfWork unitOfWork)
		{
			_unitOfWork = unitOfWork;
			_passwordHasher = new PasswordHasher<ApplicationUser>();
		}

		[HttpPost("register")]
		public async Task<IActionResult> Register([FromBody] ApplicationUser model)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			// Check if the username or email is already taken
			if (_unitOfWork.ApplicationUser.Get(u => u.Username == model.Username || u.Email == model.Email) != null)
				return BadRequest("Username or Email is already taken");

			// Create the new user
			var user = new ApplicationUser
			{
				Id = Guid.NewGuid(),
				Username = model.Username,
				Email = model.Email,
				Name = model.Name,
				WatchedMoviesCount = 0,
				ReviewsCount = 0
			};

			// Hash the password
			user.Password = _passwordHasher.HashPassword(user, model.Password);

			// Save user to database
			_unitOfWork.ApplicationUser.Add(user);
			_unitOfWork.Save();

			return Ok(new {message = "Registration succesful!"});
		}

		[HttpPost("login")]
		public async Task<IActionResult> Login([FromBody] LoginDto model)
		{
			if (!ModelState.IsValid)
				return BadRequest(ModelState);

			// Find the user by either username or email
			var user = _unitOfWork.ApplicationUser.Get(u => u.Username == model.Identifier || u.Email == model.Identifier);
			if (user == null)
				return Unauthorized("Invalid username or password");

			// Verify the password
			var result = _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password);
			if (result == PasswordVerificationResult.Failed)
				return Unauthorized("Invalid username or password");

			// Return user data upon successful login
			return Ok(new
			{
				message = "Login successful!",
				user = new
				{
					user.Id,
					user.Username,
					user.Email,
					user.Name,
					user.WatchedMoviesCount,
					user.ReviewsCount,
					user.Password
				}
			});
		}


		[HttpGet("{username}")]
		public IActionResult GetUser(string username)
		{
			var user = _unitOfWork.ApplicationUser.Get(u => u.Username == username);
			if (user == null)
				return NotFound("User not found");

			return Ok(user);
		}

		[HttpGet("id/{Id}")]
		public IActionResult GetUserById(Guid Id)
		{
			var user = _unitOfWork.ApplicationUser.Get(u => u.Id == Id);
			if (user == null)
				return NotFound("User not found");

			return Ok(user);
		}

		[HttpDelete("username/{username}")]
		public IActionResult DeleteAccount(string username)
		{
			var user = _unitOfWork.ApplicationUser.Get(u => u.Username == username);
			if (user == null)
				return NotFound("User not found");

			_unitOfWork.ApplicationUser.Remove(user);
			_unitOfWork.Save();

			return Ok("User account deleted successfully!");
		}
	}
}
