using CarAuction.Services;
using CarAuction.Data.Dtos.Bid;

namespace CarAuction.UnitTests.Services
{
    public class BidServiceTests
    {
        private readonly BidService _bidService;

        public BidServiceTests()
        {
            _bidService = new BidService();
        }

        [Theory]
        // basePrice, carType, basicBuyerFee, sellerSpecialFee, associationFee, storageFee, totalCost
        [InlineData(398, "Common", 39.80, 7.96, 5, 100, 550.76)]
        [InlineData(501, "Common", 50, 10.02, 10, 100, 671.02)]
        [InlineData(57, "Common", 10, 1.14, 5, 100, 173.14)]
        [InlineData(1800, "Luxury", 180, 72, 15, 100, 2167)]
        [InlineData(1100, "Common", 50, 22, 15, 100, 1287)]
        [InlineData(1000000, "Luxury", 200, 40000, 20, 100, 1040320)]
        public void CalculateCost_ReturnsExpectedFees(
            double basePrice, string carType,
            double expectedBuyerFee, double expectedSellerFee,
            double expectedAssociationFee, double expectedStorageFee, double expectedTotalCost)
        {
            // Arrange
            var bidInDto = new BidInDto
            {
                BasePrice = basePrice,
                CarType = carType
            };

            // Act
            var result = _bidService.CalculateCost(bidInDto);

            // Assert
            Assert.Equal(expectedBuyerFee, result.BasicBuyerFee, 2);
            Assert.Equal(expectedSellerFee, result.SellerSpecialFee, 2);
            Assert.Equal(expectedAssociationFee, result.AssociationFee, 2);
            Assert.Equal(expectedStorageFee, result.StorageFee, 2);
            Assert.Equal(expectedTotalCost, result.TotalCost, 2);
        }
    }
}