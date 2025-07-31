using Microsoft.AspNetCore.Mvc;
using CarAuction.Data.Dtos.Bid;
using CarAuction.Services.Interfaces;

namespace CarAuction.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class BidsController(IBidService bidService) : ControllerBase
	{
		private readonly IBidService _bidService = bidService;

		[HttpPost("calculate")]
		public IActionResult CalculateBid([FromBody] BidInDto bidIn)
		{
			if (!ModelState.IsValid) return BadRequest(ModelState);
			var bidOut = _bidService.CalculateCost(bidIn);

			return Ok(bidOut);
		}

		[HttpGet("car-types")]
		public IActionResult GetCarTypes()
		{
			var carTypes = _bidService.GetCarTypes();
			return Ok(carTypes);
		}
	}
}
