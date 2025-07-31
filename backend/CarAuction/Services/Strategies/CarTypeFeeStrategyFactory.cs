using CarAuction.Data.Enums;

namespace CarAuction.Services.Strategies
{
    public static class CarTypeFeeStrategyFactory
    {
        public static ICarTypeFeeStrategy GetStrategy(CarType carType)
        {
            return carType switch
            {
                CarType.Common => new CommonCarFeeStrategy(),
                CarType.Luxury => new LuxuryCarFeeStrategy(),
                _ => throw new ArgumentException("Invalid car type")
            };
        }
    }
}