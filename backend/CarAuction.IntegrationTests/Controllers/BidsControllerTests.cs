using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Text;
using System.Text.Json;
using CarAuction.Data.Dtos.Bid;

namespace CarAuction.IntegrationTests.Controllers
{
    public class BidsControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;
        private readonly JsonSerializerOptions _jsonOptions;

        public BidsControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DictionaryKeyPolicy = JsonNamingPolicy.CamelCase
            };
        }

        [Theory]
        // basePrice, carType, basicBuyerFee, sellerSpecialFee, associationFee, storageFee, totalCost
        [InlineData(398, "Common", 39.80, 7.96, 5, 100, 550.76)]
        [InlineData(501, "Common", 50, 10.02, 10, 100, 671.02)]
        [InlineData(57, "Common", 10, 1.14, 5, 100, 173.14)]
        [InlineData(1800, "Luxury", 180, 72, 15, 100, 2167)]
        [InlineData(1100, "Common", 50, 22, 15, 100, 1287)]
        [InlineData(1000000, "Luxury", 200, 40000, 20, 100, 1040320)]
        public async Task CalculateBid_DifferentInputs_ReturnsExpectedFees(
            decimal basePrice, string carType,
            decimal expectedBuyerFee, decimal expectedSellerFee,
            decimal expectedAssociationFee, decimal expectedStorageFee, decimal expectedTotalCost)
        {
            // Arrange
            var bidInDto = new BidInDto
            {
                BasePrice = basePrice,
                CarType = carType
            };

            var json = JsonSerializer.Serialize(bidInDto, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();
            var bidOutDto = JsonSerializer.Deserialize<BidOutDto>(responseContent, _jsonOptions);

            Assert.NotNull(bidOutDto);
            Assert.Equal(expectedBuyerFee, bidOutDto.BasicBuyerFee, 2);
            Assert.Equal(expectedSellerFee, bidOutDto.SellerSpecialFee, 2);
            Assert.Equal(expectedAssociationFee, bidOutDto.AssociationFee, 2);
            Assert.Equal(expectedStorageFee, bidOutDto.StorageFee, 2);
            Assert.Equal(expectedTotalCost, bidOutDto.TotalCost, 2);
        }

        [Fact]
        public async Task CalculateBid_InvalidCarType_ReturnsBadRequest()
        {
            // Arrange
            var invalidJson = @"{""basePrice"": 1000, ""carType"": ""Invalid""}";
            var content = new StringContent(invalidJson, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CalculateBid_MissingBasePrice_ReturnsBadRequest()
        {
            // Arrange
            var invalidJson = @"{""carType"": ""Common""}";
            var content = new StringContent(invalidJson, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CalculateBid_NegativeBasePrice_ReturnsBadRequest()
        {
            // Arrange
            var bidInDto = new BidInDto
            {
                BasePrice = -100.0m,
                CarType = "Common"
            };

            var json = JsonSerializer.Serialize(bidInDto, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CalculateBid_ZeroBasePrice_ReturnsBadRequest()
        {
            // Arrange
            var bidInDto = new BidInDto
            {
                BasePrice = 0.0m,
                CarType = "Common"
            };

            var json = JsonSerializer.Serialize(bidInDto, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CalculateBid_MissingCarType_ReturnsBadRequest()
        {
            // Arrange
            var invalidJson = @"{""basePrice"": 1000}";
            var content = new StringContent(invalidJson, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CalculateBid_EmptyBody_ReturnsBadRequest()
        {
            // Arrange
            var content = new StringContent("", Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CalculateBid_InvalidJson_ReturnsBadRequest()
        {
            // Arrange
            var invalidJson = @"{""basePrice"": ""invalid"", ""carType"": ""Common""}";
            var content = new StringContent(invalidJson, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task CalculateBid_ValueOverUpperBasePriceLimit_ReturnsBadRequest()
        {
            // Arrange
            var bidInDto = new BidInDto
            {
                BasePrice = decimal.MaxValue,
                CarType = "Luxury"
            };

            var json = JsonSerializer.Serialize(bidInDto, _jsonOptions);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Act
            var response = await _client.PostAsync("/api/bids/calculate", content);

            // Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}