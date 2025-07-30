using Moq;
using Microsoft.AspNetCore.Mvc;
using CarAuction.Controllers;
using CarAuction.Data.Dtos.Bid;
using CarAuction.Data.Enums;
using CarAuction.Services.Interfaces;

namespace CarAuction.UnitTests.Controllers
{
    public class BidsControllerTests
    {
        private readonly BidsController _controller;
        private readonly Mock<IBidService> _mockBidService;

        public BidsControllerTests()
        {
            _mockBidService = new Mock<IBidService>();
            _controller = new BidsController(_mockBidService.Object);
        }

        [Fact]
        public void CalculateBid_ValidInput_ReturnsOkResult()
        {
            // Arrange
            var bidIn = new BidInDto { BasePrice = 1000, CarType = CarType.Luxury };
            var bidOut = new BidOutDto { BasicBuyerFee = 100, SellerSpecialFee = 40, AssociationFee = 10, StorageFee = 100 };
            _mockBidService.Setup(service => service.CalculateCost(bidIn)).Returns(bidOut);

            // Act
            var result = _controller.CalculateBid(bidIn);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(bidOut, okResult.Value);
        }

        [Theory]
        // basePrice, carType, basicBuyerFee, sellerSpecialFee, associationFee, storageFee
        [InlineData(398, CarType.Common, 39.80, 7.96, 5, 100)]
        [InlineData(501, CarType.Common, 50, 10.02, 10, 100)]
        [InlineData(57, CarType.Common, 10, 1.14, 5, 100)]
        [InlineData(1800, CarType.Luxury, 180, 72, 15, 100)]
        [InlineData(1100, CarType.Common, 50, 22, 15, 100)]
        [InlineData(1000000, CarType.Luxury, 200, 40000, 20, 100)]
        public void CalculateBid_ValidInput_ReturnsOkResult_WithDifferentInputs(
            decimal basePrice, CarType carType, decimal basicBuyerFee, decimal sellerSpecialFee, decimal associationFee, decimal storageFee)
        {
            // Arrange
            var bidIn = new BidInDto { BasePrice = basePrice, CarType = carType };
            var bidOut = new BidOutDto
            {
                BasicBuyerFee = basicBuyerFee,
                SellerSpecialFee = sellerSpecialFee,
                AssociationFee = associationFee,
                StorageFee = storageFee
            };
            _mockBidService.Setup(service => service.CalculateCost(bidIn)).Returns(bidOut);

            // Act
            var result = _controller.CalculateBid(bidIn);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(bidOut, okResult.Value);
        }

        [Fact]
        public void CalculateBid_InvalidModelState_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("Test", "Invalid model state");
            var bidIn = new BidInDto { BasePrice = 0, CarType = CarType.Common };

            // Act
            var result = _controller.CalculateBid(bidIn);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
