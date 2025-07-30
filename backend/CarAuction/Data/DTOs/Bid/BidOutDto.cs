namespace CarAuction.Data.Dtos.Bid
{
	public class BidOutDto
	{
		public decimal BasePrice { get; set; }
		public decimal BasicBuyerFee { get; set; }
		public decimal SellerSpecialFee { get; set; }
		public decimal AssociationFee { get; set; }
		public decimal StorageFee { get; set; }
		public decimal TotalCost => BasePrice + BasicBuyerFee + SellerSpecialFee + AssociationFee + StorageFee;
  }
}
