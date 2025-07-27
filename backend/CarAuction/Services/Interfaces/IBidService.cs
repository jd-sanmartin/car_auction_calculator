using CarAuction.Data.Dtos.Bid;

namespace CarAuction.Services.Interfaces
{
    public interface IBidService
    {
        BidOutDto CalculateCost(BidInDto bidInDto);
    }
}