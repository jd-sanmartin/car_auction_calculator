using CarAuction.Services;
using CarAuction.Data.Dtos.Bid;
using CarAuction.Data.Enums;
using CarAuction.Data.Dtos;

namespace CarAuction.UnitTests.Services
{
    public class BidServiceTests
    {
        private readonly BidService _bidService;

        public BidServiceTests()
        {
            _bidService = new BidService();
        }

        [Fact]
        public void GetCarTypes_ReturnsAllCarTypes()
        {
            // Arrange
            var expectedCarTypes = new List<CarTypeDto>
            {
                new() { Id = 0, Name = "Common" },
                new() { Id = 1, Name = "Luxury" }
            };

            // Act
            var carTypes = _bidService.GetCarTypes();

            // Assert
            Assert.NotNull(carTypes);
            Assert.NotEmpty(carTypes);
            Assert.Equal(expectedCarTypes.Count, carTypes.Count);
            for (int i = 0; i < expectedCarTypes.Count; i++)
            {
                Assert.Equal(expectedCarTypes[i].Id, carTypes[i].Id);
                Assert.Equal(expectedCarTypes[i].Name, carTypes[i].Name);
            }
        }

        [Theory]
        // basePrice, carType, basicBuyerFee, sellerSpecialFee, associationFee, storageFee, totalCost
        [InlineData(398, CarType.Common, 39.80, 7.96, 5, 100, 550.76)]
        [InlineData(501, CarType.Common, 50, 10.02, 10, 100, 671.02)]
        [InlineData(57, CarType.Common, 10, 1.14, 5, 100, 173.14)]
        [InlineData(1800, CarType.Luxury, 180, 72, 15, 100, 2167)]
        [InlineData(1100, CarType.Common, 50, 22, 15, 100, 1287)]
        [InlineData(1000000, CarType.Luxury, 200, 40000, 20, 100, 1040320)]
        public void CalculateCost_ReturnsExpectedFees(
            decimal basePrice, CarType carType,
            decimal expectedBuyerFee, decimal expectedSellerFee,
            decimal expectedAssociationFee, decimal expectedStorageFee, decimal expectedTotalCost)
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

        [Fact]
        public void CalculateCost_InvalidPrice_ThrowsArgumentException()
        {
            // Arrange
            var bidInDto = new BidInDto
            {
                BasePrice = -100,
                CarType = CarType.Common
            };

            // Act
            //  Assert
            var exception = Assert.Throws<ArgumentException>(() => _bidService.CalculateCost(bidInDto));
            Assert.Equal("Invalid base price", exception.Message);
        }

        [Fact]
        public void CalculateCost_InvalidCarType_ThrowsArgumentException()
        {
            // Arrange
            var bidInDto = new BidInDto
            {
                BasePrice = 1000,
                CarType = (CarType)999 // Invalid car type
            };

            // Act
            // Assert
            var exception = Assert.Throws<ArgumentException>(() => _bidService.CalculateCost(bidInDto));
            Assert.Equal("Invalid car type", exception.Message);
        }
    }
}