using System.ComponentModel.DataAnnotations;

namespace Client_Homework.Server.DTOs
{
	public class LoginDto
	{
		[Required]
		public string Identifier { get; set; } // Can be username or email

		[Required]
		public string Password { get; set; }
	}
}
