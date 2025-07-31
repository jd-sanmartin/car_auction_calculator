using CarAuction.Data.Dtos.Bid;

namespace CarAuction.Services.Strategies
{
    public class LuxuryCarFeeStrategy : ICarTypeFeeStrategy
    {
        private const decimal BasicBuyerFeeRate = 0.1m;
        private const decimal BasicBuyerFeeMin = 25m;
        private const decimal BasicBuyerFeeMax = 200m;
        private const decimal SellerSpecialFeeRate = 0.04m;
        private const decimal StorageFee = 100m;

        private decimal CalculateBasicBuyerFee(decimal basePrice) => Math.Clamp(basePrice * BasicBuyerFeeRate, BasicBuyerFeeMin, BasicBuyerFeeMax);

        private decimal CalculateSellerSpecialFee(decimal basePrice) => basePrice * SellerSpecialFeeRate;

        private decimal CalculateAssociationFee(decimal basePrice) =>
            basePrice switch
            {
                >= 1 and <= 500 => 5,
                > 500 and <= 1000 => 10,
                > 1000 and <= 3000 => 15,
                > 3000 => 20,
                _ => 5
            };

        public BidOutDto CalculateFees(BidInDto bidInDto)
        {
            return new BidOutDto
            {
                BasePrice = bidInDto.BasePrice,
                BasicBuyerFee = CalculateBasicBuyerFee(bidInDto.BasePrice),
                SellerSpecialFee = CalculateSellerSpecialFee(bidInDto.BasePrice),
                AssociationFee = CalculateAssociationFee(bidInDto.BasePrice),
                StorageFee = StorageFee
            };
        }
    }
}
