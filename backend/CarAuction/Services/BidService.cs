using CarAuction.Data.Dtos.Bid;
using CarAuction.Services.Interfaces;

namespace CarAuction.Services
{
	public class BidService : IBidService
	{
		public BidOutDto CalculateCost(BidInDto bidInDto)
		{
			double basePrice = bidInDto.BasePrice;

			// TODO: Avoid using magic numbers and use constants instead in order to avoid calculating these values every time
			double basicBuyerFeeMinValue = bidInDto.CarType == "Common" ? 10 : 25;
			double basicBuyerFeeMaxValue = bidInDto.CarType == "Common" ? 50 : 200;
			double basicBuyerFee = Math.Clamp(basePrice * 0.1, basicBuyerFeeMinValue, basicBuyerFeeMaxValue);

			double sellerSpecialFee = basePrice * (bidInDto.CarType == "Common" ? 0.02 : 0.04);

			double associationFee = basePrice switch
			{
				>= 1 and <= 500 => 5,
				> 500 and <= 1000 => 10,
				> 1000 and <= 3000 => 15,
				> 3000 => 20,
				_ => 5 // TODO: What should the default value be?
			};
			double storageFee = 100;

			return new BidOutDto
			{
				BasePrice = basePrice,
				BasicBuyerFee = basicBuyerFee,
				SellerSpecialFee = sellerSpecialFee,
				AssociationFee = associationFee,
				StorageFee = storageFee
			};
		}
	}
}