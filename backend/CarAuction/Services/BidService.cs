using CarAuction.Data.Dtos.Bid;
using CarAuction.Services.Interfaces;

namespace CarAuction.Services
{
	public class BidService : IBidService
	{
		public BidOutDto CalculateCost(BidInDto bidInDto)
		{
			decimal basePrice = bidInDto.BasePrice;

			// TODO: Avoid using magic numbers and use constants instead in order to avoid calculating these values every time
			decimal basicBuyerFeeMinValue = bidInDto.CarType == "Common" ? 10 : 25;
			decimal basicBuyerFeeMaxValue = bidInDto.CarType == "Common" ? 50 : 200;
			decimal basicBuyerFee = Math.Clamp(basePrice * 0.1m, basicBuyerFeeMinValue, basicBuyerFeeMaxValue);

			decimal sellerSpecialFee = basePrice * (bidInDto.CarType == "Common" ? 0.02m : 0.04m);

			decimal associationFee = basePrice switch
			{
				>= 1 and <= 500 => 5,
				> 500 and <= 1000 => 10,
				> 1000 and <= 3000 => 15,
				> 3000 => 20,
				_ => 5 // TODO: What should the default value be?
			};
			decimal storageFee = 100;

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