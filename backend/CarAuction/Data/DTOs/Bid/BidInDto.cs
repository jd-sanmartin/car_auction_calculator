using System.ComponentModel.DataAnnotations;

namespace CarAuction.Data.Dtos.Bid
{
  public class BidInDto
  {
    [Required(ErrorMessage = "BasePrice is required.")]
    [Range(typeof(decimal), "1", "999999999.99", ErrorMessage = "BasePrice must be greater than zero.")]
    public decimal BasePrice { get; set; }

    /// <summary>
    /// Car type. Allowed values: "Common", "Luxury".
    /// </summary>
    [Required(ErrorMessage = "CarType is required.")]
    [RegularExpression("^(Common|Luxury)$", ErrorMessage = "CarType must be either 'Common' or 'Luxury'.")]
    public required string CarType { get; set; }
  }
}
