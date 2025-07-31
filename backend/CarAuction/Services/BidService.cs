using CarAuction.Data.Dtos;
using CarAuction.Data.Dtos.Bid;
using CarAuction.Data.Enums;
using CarAuction.Services.Interfaces;
using CarAuction.Services.Strategies;

namespace CarAuction.Services
{
	public class BidService : IBidService
	{
		public BidOutDto CalculateCost(BidInDto bidInDto)
		{
			var feeStrategy = CarTypeFeeStrategyFactory.GetStrategy(bidInDto.CarType);
			return feeStrategy.CalculateFees(bidInDto);
		}

		public List<CarTypeDto> GetCarTypes()
		{
			return [.. Enum.GetValues<CarType>()
				.Select(carType => new CarTypeDto
				{
					Id = (int)carType,
					Name = carType.ToString()
				})];
		}
	}
}