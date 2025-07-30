using System.ComponentModel.DataAnnotations;
using CarAuction.Data.Enums;

namespace CarAuction.Data.Dtos.Bid
{
  public class BidInDto
  {
    [Required(ErrorMessage = "BasePrice is required.")]
    [Range(typeof(decimal), "1", "999999999.99", ErrorMessage = "BasePrice must be greater than zero.")]
    public decimal BasePrice { get; set; }

    [Required(ErrorMessage = "CarType is required.")]
    [EnumDataType(typeof(CarType), ErrorMessage = "CarType must be valid")]
    public required CarType CarType { get; set; }
  }
}
