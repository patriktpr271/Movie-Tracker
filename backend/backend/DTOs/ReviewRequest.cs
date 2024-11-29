namespace Client_Homework.Server.DTOs
{
	public class ReviewRequest
	{
		public Guid UserId { get; set; }
		public int MovieId { get; set; }
		public string ReviewText { get; set; }
		public double Rating { get; set; }
	}

}
