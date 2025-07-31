using CarAuction.Data.Dtos.Bid;

namespace CarAuction.Services.Strategies
{
    public interface ICarTypeFeeStrategy
    {
        BidOutDto CalculateFees(BidInDto bidInDto);
    }
}
