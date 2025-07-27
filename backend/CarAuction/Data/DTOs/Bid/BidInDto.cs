using System.ComponentModel.DataAnnotations;

namespace CarAuction.Data.Dtos.Bid
{
  public class BidInDto
  {
    [Required(ErrorMessage = "BasePrice is required.")]
    [Range(1, double.MaxValue, ErrorMessage = "BasePrice must be a positive value.")]
    public double BasePrice { get; set; }

    /// <summary>
    /// Car type. Allowed values: "Common", "Luxury".
    /// </summary>
    [Required(ErrorMessage = "CarType is required.")]
    [RegularExpression("^(Common|Luxury)$", ErrorMessage = "CarType must be either 'Common' or 'Luxury'.")]
    public string CarType { get; set; } = "Common";
  }
}
