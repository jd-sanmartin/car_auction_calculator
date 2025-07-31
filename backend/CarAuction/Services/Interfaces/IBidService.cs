using CarAuction.Data.Dtos;
using CarAuction.Data.Dtos.Bid;
using CarAuction.Data.Enums;

namespace CarAuction.Services.Interfaces
{
    public interface IBidService
    {
        BidOutDto CalculateCost(BidInDto bidInDto);
        List<CarTypeDto> GetCarTypes();
    }
}